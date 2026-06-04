import React, { useContext, useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { Briefcase } from 'lucide-react'

const AIJobRecommender = () => {
    const { user } = useUser()
    const { getToken } = useAuth()
    const { backendUrl, userData } = useContext(AppContext)

    const [loading, setLoading] = useState(false)
    const [recommendations, setRecommendations] = useState(null)
    const [error, setError] = useState(null)

    const fetchRecommendations = async () => {
        if (!userData || !userData.resume) {
            setError("Please upload your resume in the 'Applications' page first.")
            return
        }

        setLoading(true)
        setError(null)
        try {
            const token = await getToken()
            const { data } = await axios.get(`${backendUrl}/api/users/ai-recommender`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                setRecommendations(data)
                if (data.message) {
                    toast.info(data.message)
                }
            } else {
                setError(data.message)
                toast.error(data.message)
            }
        } catch (err) {
            setError("Failed to fetch recommendations. Please try again.")
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="container px-4 py-12 mx-auto 2xl:px-20">
                <div className="flex flex-col items-center mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
                        AI <span className="text-blue-600">Job Recommender</span>
                    </h1>
                    <p className="max-w-2xl text-lg text-gray-600">
                        Our AI analyzes your resume to find the most relevant jobs from across the **globe**.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 mb-4 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
                        <p className="text-xl font-medium text-gray-700">Analyzing your resume & searching for jobs...</p>
                    </div>
                ) : error ? (
                    <div className="max-w-md p-8 mx-auto text-center bg-red-50 rounded-2xl border border-red-100">
                        <p className="mb-6 text-red-600">{error}</p>
                        <button
                            onClick={() => window.location.href = '/applications'}
                            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go to Applications
                        </button>
                    </div>
                ) : recommendations ? (
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Sidebar: Extracted Keywords */}
                        <div className="lg:col-span-1">
                            <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm">
                                <h3 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span className="p-2 bg-blue-600 text-white rounded-lg">✨</span>
                                    Resume Insights
                                </h3>
                                <p className="mb-6 text-sm text-gray-600">These keywords were extracted from your resume to match against live job listings.</p>
                                <div className="flex flex-wrap gap-2">
                                    {recommendations.keywords.map((keyword, index) => (
                                        <span key={index} className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={fetchRecommendations}
                                    className="w-full mt-8 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition-all shadow-sm"
                                >
                                    Refresh Search
                                </button>
                            </div>
                        </div>

                        {/* Main Content: Job Results */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Recommended Jobs</h3>
                                <span className="text-gray-500 font-medium">{recommendations.jobs.length} Results Found</span>
                            </div>

                            {recommendations.jobs.length > 0 ? (
                                <div className="space-y-4">
                                    {recommendations.jobs.map((job, index) => (
                                        <div key={index} className='p-4 sm:p-6 transition-all bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 group'>
                                            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                                                <div className='flex gap-3 sm:gap-4'>
                                                    <div className='flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors shrink-0'>
                                                        <Briefcase className='w-5 h-5 sm:w-6 sm:h-6 text-blue-600 opacity-80' />
                                                    </div>
                                                    <div>
                                                        <h4 className='text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>{job.title}</h4>
                                                        <p className='text-sm sm:text-base font-medium text-gray-600'>{job.company}</p>
                                                        <div className='flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs sm:text-sm text-gray-500'>
                                                            <span className='flex items-center gap-1'>📍 {job.location || 'Remote'}</span>
                                                            {job.type && <span className='flex items-center gap-1'>💼 {job.type}</span>}
                                                            {job.salary && <span className='flex items-center gap-1 font-semibold text-green-600'>💰 {job.salary}</span>}
                                                        </div>
                                                        {(job.department || job.seniority) && (
                                                            <div className='flex flex-wrap gap-2 mt-3'>
                                                                {job.department && (
                                                                    <span className='px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-purple-700 bg-purple-50 rounded-md border border-purple-200'>
                                                                        {job.department}
                                                                    </span>
                                                                )}
                                                                {job.seniority && (
                                                                    <span className='px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-orange-700 bg-orange-50 rounded-md border border-orange-200'>
                                                                        {job.seniority}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <a
                                                    href={job.url}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='w-full sm:w-auto text-center px-5 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-all'
                                                >
                                                    Apply Now →
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl">
                                    <p className="text-gray-500">No jobs found matching your keywords at the moment. Try updating your resume with more technical skills!</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="p-8 bg-blue-50 rounded-full mb-6">
                            <span className="text-5xl">📄</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to find your match?</h3>
                        <p className="text-gray-600 mb-8 max-w-sm">Click the button below to start the AI analysis of your resume.</p>
                        <button
                            onClick={fetchRecommendations}
                            className="px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all"
                        >
                            Analyze Resume
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default AIJobRecommender
