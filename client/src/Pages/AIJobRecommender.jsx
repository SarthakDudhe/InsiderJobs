import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BrainCircuit, Briefcase, RefreshCw, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AIJobRecommender = () => {
  const { getToken } = useAuth()
  const { backendUrl, userData } = useContext(AppContext)
  const navigate = useNavigate()
  useUser()

  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState(null)
  const [error, setError] = useState(null)
  const [keywords, setKeywords] = useState([])
  const [newKeywordInput, setNewKeywordInput] = useState("")

  const fetchRecommendations = async (customKeywordsList = null) => {
    if (!userData || !userData.resume) {
      setError("Please upload your resume in the Applications page first.")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      const url = customKeywordsList && customKeywordsList.length > 0
        ? `${backendUrl}/api/users/ai-recommender?keywords=${encodeURIComponent(customKeywordsList.join(','))}`
        : `${backendUrl}/api/users/ai-recommender`

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setRecommendations(data)
        setKeywords(data.keywords || [])
        if (data.message) toast.info(data.message)
      } else {
        setError(data.message)
        toast.error(data.message)
      }
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again.')
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddKeyword = (e) => {
    e.preventDefault()
    const trimmed = newKeywordInput.trim()
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords(prev => [...prev, trimmed])
      setNewKeywordInput("")
    }
  }

  const removeKeyword = (keywordToRemove) => {
    setKeywords(prev => prev.filter(k => k !== keywordToRemove))
  }

  return (
    <div className='min-h-screen ij-shell'>
      <Navbar />
      <main className='ij-container py-12'>
        <div className='relative mb-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.13),transparent_26rem),linear-gradient(135deg,#ffffff,#eef5ff)] p-7 shadow-[0_30px_80px_rgba(15,23,42,0.1)] md:p-10'>
          <div className='relative z-10 max-w-3xl'>
            <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-700'>
              <BrainCircuit size={15} /> AI career intelligence
            </div>
            <h1 className='mb-4 text-4xl font-extrabold leading-tight text-slate-950 md:text-6xl'>
              Recommendations shaped by your resume, not generic keywords.
            </h1>
            <p className='max-w-2xl text-lg leading-relaxed text-slate-600'>
              Upload your resume once, then let InsiderJobs surface relevant roles, extracted strengths, and live opportunities in a focused AI workspace.
            </p>
          </div>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white/90 py-20 text-center shadow-sm'>
            <div className='mb-5 h-16 w-16 animate-spin rounded-full border-4 border-blue-400/20 border-t-blue-400' />
            <p className='text-xl font-bold text-slate-950'>Analyzing your resume and searching for jobs...</p>
            <p className='mt-2 text-sm text-slate-500'>Matching skills, seniority, location, and role intent.</p>
          </div>
        ) : error ? (
          <div className='mx-auto max-w-md rounded-[1.5rem] border border-red-200 bg-red-50 p-8 text-center'>
            <p className='mb-6 text-red-700'>{error}</p>
            <button onClick={() => navigate('/applications')} className='premium-button px-6 py-3'>
              Go to Applications
            </button>
          </div>
        ) : recommendations ? (
          <div className='grid gap-7 lg:grid-cols-3'>
            <aside className='lg:col-span-1'>
              <div className='sticky top-24 rounded-[1.5rem] border border-slate-200 bg-white/90 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur'>
                <h3 className='mb-4 flex items-center gap-2 text-xl font-extrabold text-slate-950'>
                  <span className='rounded-xl bg-blue-500 p-2 text-white'><Sparkles size={18} /></span>
                  Resume Insights
                </h3>
                <p className='mb-4 text-sm leading-relaxed text-slate-500'>Keywords extracted from your resume. Add or remove tags to refine job listings.</p>
                
                <div className='flex flex-wrap gap-2'>
                  {keywords.map((keyword, index) => (
                    <span key={index} className='inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 pl-3 pr-2 py-1.5 text-sm font-bold text-blue-700'>
                      {keyword}
                      <button 
                        onClick={() => removeKeyword(keyword)} 
                        className='inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-500 transition-all hover:bg-blue-100 hover:text-blue-800 text-xs font-normal'
                        title="Remove Keyword"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddKeyword} className='mt-4 flex gap-2'>
                  <input
                    type='text'
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                    placeholder='Add skill or role...'
                    className='w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none'
                  />
                  <button type='submit' className='premium-button px-4 py-2 text-sm shrink-0'>
                    Add
                  </button>
                </form>

                <button onClick={() => fetchRecommendations(keywords)} className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500 bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-md shadow-blue-500/20'>
                  <RefreshCw size={16} /> Search Custom Keywords
                </button>

                <button onClick={() => fetchRecommendations(null)} className='mt-2 text-xs text-slate-500 hover:text-blue-700 transition-all underline w-full text-center'>
                  Reset to Resume Keywords
                </button>
              </div>
            </aside>

            <section className='lg:col-span-2'>
              <div className='mb-6 flex items-center justify-between'>
                <h3 className='text-2xl font-extrabold text-slate-950'>Recommended Jobs</h3>
                <span className='status-chip border border-slate-200 bg-white text-slate-600'>{recommendations.jobs.length} found</span>
              </div>

              {recommendations.jobs.length > 0 ? (
                <div className='space-y-4'>
                  {recommendations.jobs.map((job, index) => (
                    <div key={index} className='group rounded-[1.35rem] border border-slate-200 bg-white/90 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_55px_rgba(37,99,235,0.1)] sm:p-6'>
                      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                        <div className='flex gap-4'>
                          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100'>
                            <Briefcase size={22} />
                          </div>
                          <div>
                            <h4 className='text-lg font-extrabold text-slate-950 transition-colors group-hover:text-blue-700'>{job.title}</h4>
                            <p className='font-semibold text-slate-600'>{job.company}</p>
                            <div className='mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500'>
                              <span>{job.location || 'Remote'}</span>
                              {job.type && <span>{job.type}</span>}
                              {job.salary && <span className='text-green-700'>{job.salary}</span>}
                            </div>
                            {(job.department || job.seniority) && (
                              <div className='mt-3 flex flex-wrap gap-2'>
                                {job.department && <span className='rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600'>{job.department}</span>}
                                {job.seniority && <span className='rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700'>{job.seniority}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                        <a href={job.url} target='_blank' rel='noopener noreferrer' className='premium-button w-full px-5 py-3 text-sm sm:w-auto'>
                          Apply Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 p-12 text-center'>
                  <p className='text-slate-500'>No jobs matched these keywords yet. Try updating your resume with more technical skills.</p>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white/90 py-20 text-center shadow-sm'>
            <div className='mb-6 rounded-[2rem] border border-blue-100 bg-blue-50 p-7'>
              <BrainCircuit size={52} className='text-blue-600' />
            </div>
            <h3 className='mb-2 text-2xl font-extrabold text-slate-950'>Ready to find your match?</h3>
            <p className='mb-8 max-w-sm text-slate-500'>Start the AI analysis and generate role recommendations from your resume.</p>
            <button onClick={fetchRecommendations} className='premium-button px-8 py-4 text-lg'>
              Analyze Resume
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default AIJobRecommender
