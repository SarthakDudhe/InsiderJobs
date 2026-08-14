import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ArrowUpRight, BrainCircuit, Briefcase, CheckCircle2, FileText, Lightbulb, MapPin, RefreshCw, Search, Sparkles, Target, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const suggestedPrompts = [
  'Find roles that match my resume',
  'Prioritize remote product teams',
  'Surface senior frontend roles',
  'Show interview-ready opportunities'
]

const AIJobRecommender = () => {
  const { backendUrl, userData, userToken } = useContext(AppContext)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState(null)
  const [error, setError] = useState(null)
  const [keywords, setKeywords] = useState([])
  const [newKeywordInput, setNewKeywordInput] = useState('')

  const fetchRecommendations = async (customKeywordsList = null) => {
    if (!userData || !userData.resume) {
      setError('Upload your resume in Applications before running AI recommendations.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const token = userToken
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
      setError('Recommendation engine is temporarily unavailable. Please try again.')
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
      setNewKeywordInput('')
    }
  }

  const removeKeyword = (keywordToRemove) => {
    setKeywords(prev => prev.filter(k => k !== keywordToRemove))
  }

  return (
    <div className='min-h-screen ij-shell'>
      <Navbar />
      <main className='ij-container py-10'>
        <section className='mb-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end'>
          <div>
            <p className='section-kicker'>AI career assistant</p>
            <h1 className='mt-2 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl'>
              A focused workspace for resume-aware job discovery.
            </h1>
            <p className='mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base'>
              InsiderJobs reads your candidate context, extracts useful signals, and turns them into live role recommendations you can refine.
            </p>
          </div>
          <div className='premium-panel rounded-[1.15rem] p-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
                <BrainCircuit size={22} />
              </div>
              <div>
                <p className='text-sm font-bold text-slate-950'>Persistent career context</p>
                <p className='text-xs leading-5 text-slate-500'>Resume, skills, keywords, and live roles stay connected.</p>
              </div>
            </div>
          </div>
        </section>

        <div className='grid gap-7 lg:grid-cols-[340px_1fr]'>
          <aside className='space-y-5'>
            <div className='premium-panel rounded-[1.15rem] p-5'>
              <div className='mb-5 flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white'>
                  <FileText size={18} />
                </div>
                <div>
                  <h2 className='font-bold text-slate-950'>Candidate context</h2>
                  <p className='text-xs text-slate-500'>{userData?.resume ? 'Resume connected' : 'Resume required'}</p>
                </div>
              </div>

              <div className='space-y-3'>
                <ContextRow icon={<CheckCircle2 />} label='Profile' value={userData?.name || 'Candidate'} active={Boolean(userData)} />
                <ContextRow icon={<FileText />} label='Resume' value={userData?.resume ? 'Available for AI analysis' : 'Not uploaded'} active={Boolean(userData?.resume)} />
                <ContextRow icon={<Target />} label='Search mode' value={keywords.length ? `${keywords.length} custom signals` : 'Resume-derived'} active />
              </div>

              {!userData?.resume && (
                <button onClick={() => navigate('/applications')} className='premium-button mt-5 w-full px-5 py-3 text-sm'>
                  Upload resume
                </button>
              )}
            </div>

            <div className='premium-panel rounded-[1.15rem] p-5'>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <div>
                  <h2 className='font-bold text-slate-950'>Signal controls</h2>
                  <p className='text-xs text-slate-500'>Tune the keywords used for matching.</p>
                </div>
                <Sparkles size={18} className='text-blue-600' />
              </div>

              <div className='flex flex-wrap gap-2'>
                {keywords.length > 0 ? keywords.map((keyword, index) => (
                  <span key={`${keyword}-${index}`} className='inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 py-1.5 pl-3 pr-2 text-xs font-bold text-blue-700'>
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className='ij-focus-ring inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-500 transition-all hover:bg-blue-100 hover:text-blue-800'
                      title='Remove keyword'
                      aria-label={`Remove ${keyword}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                )) : (
                  <p className='rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500'>
                    Run analysis to extract resume keywords, or add your own search signals.
                  </p>
                )}
              </div>

              <form onSubmit={handleAddKeyword} className='mt-4 flex gap-2'>
                <input
                  type='text'
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  placeholder='Add skill or role'
                  className='premium-input w-full rounded-xl px-3 py-2 text-sm placeholder:text-slate-400'
                />
                <button type='submit' className='premium-button shrink-0 px-4 py-2 text-sm'>
                  Add
                </button>
              </form>

              <button onClick={() => fetchRecommendations(keywords)} className='premium-button mt-5 inline-flex w-full px-4 py-3 text-sm'>
                <RefreshCw size={16} /> Search custom signals
              </button>
              <button onClick={() => fetchRecommendations(null)} className='mt-3 w-full text-center text-xs font-bold text-slate-500 transition hover:text-blue-700'>
                Reset to resume signals
              </button>
            </div>
          </aside>

          <section className='premium-panel min-h-[620px] overflow-hidden rounded-[1.15rem]'>
            <div className='border-b border-slate-200 bg-white p-5'>
              <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
                <div>
                  <h2 className='text-xl font-bold text-slate-950'>Assistant workspace</h2>
                  <p className='mt-1 text-sm text-slate-500'>Generate, refine, and act on job recommendations.</p>
                </div>
                <button onClick={() => fetchRecommendations(null)} disabled={loading} className='premium-button px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60'>
                  {loading ? 'Analyzing...' : 'Analyze resume'}
                </button>
              </div>

              <div className='mt-5 flex flex-wrap gap-2'>
                {suggestedPrompts.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => {
                      const promptSignals = [...new Set([...keywords, prompt])]
                      setKeywords(promptSignals)
                      if (!loading) fetchRecommendations(promptSignals)
                    }}
                    className='ij-focus-ring rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className='p-5 md:p-6'>
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onApplications={() => navigate('/applications')} />
              ) : recommendations ? (
                <RecommendationsList recommendations={recommendations} />
              ) : (
                <StartState onStart={() => fetchRecommendations(null)} />
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

const ContextRow = ({ icon, label, value, active }) => (
  <div className='flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3'>
    <div className={`mt-0.5 ${active ? 'text-blue-600' : 'text-slate-500'}`}>
      {React.cloneElement(icon, { size: 16 })}
    </div>
    <div>
      <p className='text-xs font-bold uppercase tracking-[0.12em] text-slate-400'>{label}</p>
      <p className='mt-0.5 text-sm font-semibold text-slate-800'>{value}</p>
    </div>
  </div>
)

const LoadingState = () => (
  <div className='grid gap-4'>
    <div className='rounded-2xl border border-blue-100 bg-blue-50/70 p-5'>
      <div className='flex items-center gap-3'>
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600' />
        <div>
          <p className='font-bold text-slate-950'>AI is reading your resume and searching live roles.</p>
          <p className='text-sm text-slate-600'>Matching skills, seniority, location, and role intent.</p>
        </div>
      </div>
    </div>
    {[0, 1, 2].map(item => (
      <div key={item} className='animate-pulse rounded-2xl border border-slate-200 bg-white p-5'>
        <div className='h-4 w-1/3 rounded bg-slate-200' />
        <div className='mt-4 h-3 w-2/3 rounded bg-slate-100' />
        <div className='mt-3 h-3 w-1/2 rounded bg-slate-100' />
      </div>
    ))}
  </div>
)

const ErrorState = ({ error, onApplications }) => (
  <div className='flex min-h-[430px] flex-col items-center justify-center text-center'>
    <div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600'>
      <Lightbulb size={24} />
    </div>
    <h3 className='mt-5 text-xl font-bold text-slate-950'>AI recommendations need one more signal</h3>
    <p className='mt-2 max-w-md text-sm leading-6 text-slate-600'>{error}</p>
    <button onClick={onApplications} className='premium-button mt-6 px-6 py-3 text-sm'>
      Open Applications
    </button>
  </div>
)

const StartState = ({ onStart }) => (
  <div className='flex min-h-[430px] flex-col items-center justify-center text-center'>
    <div className='flex h-16 w-16 items-center justify-center rounded-3xl border border-blue-100 bg-blue-50 text-blue-600'>
      <BrainCircuit size={34} />
    </div>
    <h3 className='mt-6 text-2xl font-bold text-slate-950'>Ready to generate your match brief?</h3>
    <p className='mt-2 max-w-md text-sm leading-6 text-slate-600'>Start with your resume, then refine the results with custom skills, roles, or company preferences.</p>
    <button onClick={onStart} className='premium-button mt-7 px-8 py-4 text-base'>
      Analyze resume
    </button>
  </div>
)

const RecommendationsList = ({ recommendations }) => (
  <div>
    <div className='mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
      <div>
        <p className='text-sm font-bold text-slate-950'>Recommended jobs</p>
        <p className='text-xs text-slate-500'>Ranked from current resume and keyword context.</p>
      </div>
      <span className='status-chip w-fit border border-slate-200 bg-white text-slate-600'>{recommendations.jobs.length} found</span>
    </div>

    {recommendations.jobs.length > 0 ? (
      <div className='space-y-4'>
        {recommendations.jobs.map((job, index) => (
          <article key={`${job.title}-${index}`} className='group rounded-[1.15rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_55px_rgba(37,99,235,0.1)] sm:p-6'>
            <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
              <div className='flex gap-4'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100'>
                  <Briefcase size={22} />
                </div>
                <div>
                  <h4 className='text-lg font-bold text-slate-950 transition-colors group-hover:text-blue-700'>{job.title}</h4>
                  <p className='font-semibold text-slate-600'>{job.company}</p>
                  <div className='mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500'>
                    <span className='inline-flex items-center gap-1'><MapPin size={13} /> {job.location || 'Remote'}</span>
                    {job.type && <span>{job.type}</span>}
                    {job.salary && <span className='text-emerald-700'>{job.salary}</span>}
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
                Open role <ArrowUpRight size={16} />
              </a>
            </div>
          </article>
        ))}
      </div>
    ) : (
      <div className='rounded-[1.15rem] border border-dashed border-slate-300 bg-white/80 p-12 text-center'>
        <Search className='mx-auto mb-3 text-blue-600' size={28} />
        <p className='font-bold text-slate-700'>No jobs matched these signals yet.</p>
        <p className='mt-1 text-sm text-slate-500'>Try broadening keywords or adding more resume context.</p>
      </div>
    )}
  </div>
)

export default AIJobRecommender
