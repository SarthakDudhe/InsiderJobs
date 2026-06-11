import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BrainCircuit, Briefcase, RefreshCw, Sparkles } from 'lucide-react'

const AIJobRecommender = () => {
  const { getToken } = useAuth()
  const { backendUrl, userData } = useContext(AppContext)
  useUser()

  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState(null)
  const [error, setError] = useState(null)

  const fetchRecommendations = async () => {
    if (!userData || !userData.resume) {
      setError("Please upload your resume in the Applications page first.")
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

  return (
    <div className='min-h-screen bg-gray-950 text-white'>
      <Navbar />
      <main className='ij-container py-12'>
        <div className='relative mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_26rem),linear-gradient(135deg,#070a12,#111827)] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.28)] md:p-10'>
          <div className='relative z-10 max-w-3xl'>
            <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-100'>
              <BrainCircuit size={15} /> AI career intelligence
            </div>
            <h1 className='mb-4 text-4xl font-extrabold leading-tight md:text-6xl'>
              Recommendations shaped by your resume, not generic keywords.
            </h1>
            <p className='max-w-2xl text-lg leading-relaxed text-gray-300'>
              Upload your resume once, then let InsiderJobs surface relevant roles, extracted strengths, and live opportunities in a focused AI workspace.
            </p>
          </div>
        </div>

        {loading ? (
          <div className='flex flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.04] py-20 text-center'>
            <div className='mb-5 h-16 w-16 animate-spin rounded-full border-4 border-blue-400/20 border-t-blue-400' />
            <p className='text-xl font-bold text-white'>Analyzing your resume and searching for jobs...</p>
            <p className='mt-2 text-sm text-gray-400'>Matching skills, seniority, location, and role intent.</p>
          </div>
        ) : error ? (
          <div className='mx-auto max-w-md rounded-[1.5rem] border border-red-400/20 bg-red-500/10 p-8 text-center'>
            <p className='mb-6 text-red-100'>{error}</p>
            <button onClick={() => window.location.href = '/applications'} className='premium-button px-6 py-3'>
              Go to Applications
            </button>
          </div>
        ) : recommendations ? (
          <div className='grid gap-7 lg:grid-cols-3'>
            <aside className='lg:col-span-1'>
              <div className='sticky top-24 rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur'>
                <h3 className='mb-4 flex items-center gap-2 text-xl font-extrabold text-white'>
                  <span className='rounded-xl bg-blue-500 p-2 text-white'><Sparkles size={18} /></span>
                  Resume Insights
                </h3>
                <p className='mb-6 text-sm leading-relaxed text-gray-400'>Keywords extracted from your resume and used against live job listings.</p>
                <div className='flex flex-wrap gap-2'>
                  {recommendations.keywords.map((keyword, index) => (
                    <span key={index} className='rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-sm font-bold text-blue-100'>
                      {keyword}
                    </span>
                  ))}
                </div>
                <button onClick={fetchRecommendations} className='mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-white/15'>
                  <RefreshCw size={16} /> Refresh Search
                </button>
              </div>
            </aside>

            <section className='lg:col-span-2'>
              <div className='mb-6 flex items-center justify-between'>
                <h3 className='text-2xl font-extrabold text-white'>Recommended Jobs</h3>
                <span className='status-chip border border-white/10 bg-white/10 text-gray-200'>{recommendations.jobs.length} found</span>
              </div>

              {recommendations.jobs.length > 0 ? (
                <div className='space-y-4'>
                  {recommendations.jobs.map((job, index) => (
                    <div key={index} className='group rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-5 transition-all hover:border-blue-400/40 hover:bg-white/[0.07] sm:p-6'>
                      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                        <div className='flex gap-4'>
                          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-400/10 text-blue-200 ring-1 ring-blue-400/20'>
                            <Briefcase size={22} />
                          </div>
                          <div>
                            <h4 className='text-lg font-extrabold text-white transition-colors group-hover:text-blue-200'>{job.title}</h4>
                            <p className='font-semibold text-gray-300'>{job.company}</p>
                            <div className='mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-400'>
                              <span>{job.location || 'Remote'}</span>
                              {job.type && <span>{job.type}</span>}
                              {job.salary && <span className='text-green-300'>{job.salary}</span>}
                            </div>
                            {(job.department || job.seniority) && (
                              <div className='mt-3 flex flex-wrap gap-2'>
                                {job.department && <span className='rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-bold text-gray-200'>{job.department}</span>}
                                {job.seniority && <span className='rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-xs font-bold text-amber-100'>{job.seniority}</span>}
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
                <div className='rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.04] p-12 text-center'>
                  <p className='text-gray-400'>No jobs matched these keywords yet. Try updating your resume with more technical skills.</p>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.04] py-20 text-center'>
            <div className='mb-6 rounded-[2rem] border border-blue-400/20 bg-blue-400/10 p-7'>
              <BrainCircuit size={52} className='text-blue-200' />
            </div>
            <h3 className='mb-2 text-2xl font-extrabold text-white'>Ready to find your match?</h3>
            <p className='mb-8 max-w-sm text-gray-400'>Start the AI analysis and generate role recommendations from your resume.</p>
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
