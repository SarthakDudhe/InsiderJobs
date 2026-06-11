import 'dotenv/config';
import User from "../models/User.js";
import axios from "axios";
import { Groq } from "groq-sdk";
import { ApifyClient } from "apify-client";
import { PDFParse } from "pdf-parse";

export const getAIJobRecommendations = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const groqApiKey = process.env.GROK_API_KEY;
        if (!groqApiKey) {
            return res.json({ success: false, message: "Missing Groq API Key. Please add it to the server .env file." });
        }

        // Initialize Groq
        const groq = new Groq({ apiKey: groqApiKey });

        // 1. Fetch user data to get resume URL
        const user = await User.findById(userId);
        if (!user || !user.resume) {
            return res.json({ success: false, message: "Please upload your resume first." });
        }

        // 2. Download resume and extract text
        const response = await axios.get(user.resume, { responseType: 'arraybuffer' });

        // Correct usage of pdf-parse (v2)
        const parser = new PDFParse({ data: response.data });
        const data = await parser.getText();
        const resumeText = data.text;
        await parser.destroy();

        // 3. Extract keywords using Groq
        const prompt = `Based on the following resume text, identify the top 3-4 most appropriate JOB TITLES (e.g., "Full Stack Developer", "Backend Engineer") AND the top 3-4 coding skills (e.g., "React", "Node.js").
        Return the result as a JSON object with two keys: "roles" (array of strings) and "skills" (array of strings).
        Focus on specific, searchable roles.
        
        Resume Text: \n\n${resumeText}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional recruiting assistant. Return ONLY valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile", // Updated from decommissioned model
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        let extractedData;
        try {
            extractedData = JSON.parse(chatCompletion.choices[0]?.message?.content || '{"roles":[], "skills":[]}');
        } catch (e) {
            extractedData = { roles: [], skills: [] };
        }

        const roles = extractedData.roles || [];
        const skills = extractedData.skills || [];
        const combinedKeywords = [...roles, ...skills].slice(0, 5);

        // 4. Search for jobs using SerpApi Google Jobs API
        const serpApiKey = process.env.SERP_API_KEY;

        const searchJobs = async (keyword) => {
            try {
                console.log(`[AI Recommender] Searching Google Jobs (India) via SerpApi for: "${keyword}"`);

                const response = await axios.get('https://serpapi.com/search.json', {
                    params: {
                        engine: "google_jobs",
                        q: keyword,
                        location: "India",
                        api_key: serpApiKey,
                        hl: "en",
                        gl: "in" // Targeted to India
                    },
                    timeout: 15000
                });

                if (response.data && response.data.jobs_results) {
                    return response.data.jobs_results;
                }
                return [];
            } catch (error) {
                console.error(`[AI Recommender] SerpApi search error for "${keyword}":`, error.message);
                return [];
            }
        };

        // Search for the top keywords
        let allJobs = [];
        for (const role of roles.slice(0, 2)) {
            const jobs = await searchJobs(role);
            allJobs = allJobs.concat(jobs);
        }

        // Normalize and Deduplicate
        // SerpApi uses different field names: job_id, title, company_name, location, via, etc.
        const uniqueJobs = Array.from(new Map(allJobs.map(job => [job.job_id || job.title + job.company_name, job])).values()).slice(0, 15);

        res.json({
            success: true,
            keywords: combinedKeywords,
            jobs: uniqueJobs.map(job => ({
                title: job.title || "Job Opportunity",
                company: job.company_name || 'Company Not Listed',
                location: job.location || 'India',
                url: job.related_links?.find(link => link.text?.includes("Apply"))?.link || job.share_link || job.related_links?.[0]?.link || "#",
                source: job.via || "Google Jobs",
                postedAt: job.detected_extensions?.posted_at || new Date().toISOString(),
                type: job.detected_extensions?.schedule_type || 'Full-time',
                salary: job.detected_extensions?.salary || null
            }))
        });

    } catch (error) {
        console.error("AI Recommendation Error:", error);
        res.json({ success: false, message: error.message });
    }
};
