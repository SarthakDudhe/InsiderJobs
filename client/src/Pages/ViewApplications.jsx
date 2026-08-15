import React, { useContext, useEffect, useMemo, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../LoaderFront/Loader'
import { BarChart3, BrainCircuit, Check, Clock3, Eye, EyeOff, Github, Globe, Lightbulb, Linkedin, RefreshCw, RotateCcw, Sparkles, Trophy, UsersRound, X } from 'lucide-react'
import { readRecruiterCache, writeRecruiterCache } from '../utils/recruiterCache'

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext)
  const cached = readRecruiterCache(companyToken)
  const [applicants, setApplicants] = useState(cached?.applications || [])
  const [hasLoaded, setHasLoaded] = useState(Boolean(cached?.applications))
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [expandedId, setExpandedId] = useState(null)
  const [screeningIds, setScreeningIds] = useState({})
  const [revealedAnswers, setRevealedAnswers] = useState({})
  const [compareList, setCompareList] = useState([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  const toggleAnswer = (applicantId, idx) => {
    const key = `${applicantId}-${idx}`
    setRevealedAnswers(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleCandidateCompare = (applicant) => {
    setCompareList(prev => {
      const exists = prev.some(a => a._id === applicant._id)
      if (exists) {
        return prev.filter(a => a._id !== applicant._id)
      } else {
        if (prev.length >= 3) {
          toast.warning("You can compare up to 3 candidates max.")
          return prev
        }
        return [...prev, applicant]
      }
    })
  }

  const handleScreenApplication = async (applicationId) => {
    setScreeningIds(prev => ({ ...prev, [applicationId]: true }))
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/screen-application`,
        { applicationId },
        { headers: { token: companyToken } }
      )
      if (data.success) {
        toast.success(data.message)
        // Direct local state update to prevent caching/fetch lag and ensure instant UI updates
        setApplicants(prev => {
          if (!prev) return prev;
          const nextApplicants = prev.map(app => {
            if (app._id === applicationId) {
              return {
                ...app,
                aiScore: data.application.aiScore,
                aiSummary: data.application.aiSummary,
                aiQuestions: data.application.aiQuestions,
                aiAnswers: data.application.aiAnswers,
              }
            }
            return app;
          })
          writeRecruiterCache(companyToken, { applications: nextApplicants })
          return nextApplicants
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setScreeningIds(prev => ({ ...prev, [applicationId]: false }))
    }
  }

  const fetchCompanyJobs = async ({ silent = false } = {}) => {
    if (!silent) setIsRefreshing(true)
    try {
      const { data } = await axios.get(backendUrl + '/api/company/applicants', {
        headers: { token: companyToken }
      })
      if (data.success) {
        const nextApplicants = [...(data.applications || [])].reverse()
        setApplicants(nextApplicants)
        setHasLoaded(true)
        writeRecruiterCache(companyToken, { applications: nextApplicants })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      if (!silent) toast.error(error.message)
    } finally {
      setIsRefreshing(false)
    }
  }

  const changeJobStatus = async (id, status) => {
    const previousApplicants = applicants
    const nextApplicants = applicants.map(applicant => applicant._id === id ? { ...applicant, status } : applicant)
    setApplicants(nextApplicants)
    writeRecruiterCache(companyToken, { applications: nextApplicants })

    try {
      const { data } = await axios.post(backendUrl + '/api/company/change-status', { id, status }, { headers: { token: companyToken } })
      if (data.success) {
        fetchCompanyJobs({ silent: true })
      } else {
        setApplicants(previousApplicants)
        writeRecruiterCache(companyToken, { applications: previousApplicants })
        toast.error(data.message)
      }
    } catch (error) {
      setApplicants(previousApplicants)
      writeRecruiterCache(companyToken, { applications: previousApplicants })
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs({ silent: hasLoaded })
      const interval = setInterval(() => {
        fetchCompanyJobs({ silent: true })
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [companyToken])

  const filteredApplicants = useMemo(() => applicants.filter(item => item.jobId && item.userId), [applicants])
  const sortedApplicants = useMemo(() => [...filteredApplicants].sort((a, b) => {
    if (sortBy === 'aiScore') {
      const scoreA = a.aiScore ?? -1
      const scoreB = b.aiScore ?? -1
      return scoreB - scoreA
    }
    return new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0)
  }), [filteredApplicants, sortBy])
  const screenedCount = filteredApplicants.filter(applicant => applicant.aiScore !== undefined).length
  const pendingCount = filteredApplicants.filter(applicant => applicant.status === 'Pending').length
  const topMatch = filteredApplicants.reduce((best, applicant) => Math.max(best, applicant.aiScore || 0), 0)

  if (!hasLoaded) {
    return <RecruiterLoading label='Loading candidate pipeline' />
  }

  return filteredApplicants.length === 0 ? (
    <div className='flex h-[70vh] flex-col items-center justify-center text-center'>
      <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-100 bg-blue-50 shadow-sm'>
        <UsersRound className='text-blue-600' size={30} />
      </div>
      <p className='text-xl font-extrabold text-gray-950'>No applications yet</p>
      <p className='mt-2 text-gray-500'>Applications for your posted jobs will appear here.</p>
    </div>
  ) : (
    <div className='mx-auto max-w-6xl'>
      <div className='mb-6 grid gap-5 xl:grid-cols-[1fr_420px] xl:items-end'>
        <div>
          <p className='section-kicker'>Candidate review</p>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl'>Recruiter candidate pipeline</h1>
          <p className='mt-3 max-w-2xl text-sm leading-7 text-slate-600'>Candidate rows hydrate from cache first, then status, resumes, links, and AI screening data refresh quietly in the background.</p>
        </div>
        <div className='grid gap-3 sm:grid-cols-3'>
          <RecruiterStat icon={<UsersRound />} label='Candidates' value={filteredApplicants.length} />
          <RecruiterStat icon={<Clock3 />} label='Pending' value={pendingCount} tone='amber' />
          <RecruiterStat icon={<Trophy />} label='Top match' value={`${topMatch}%`} tone='emerald' />
        </div>
      </div>

      <div className='mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm'>
        <div className='flex flex-wrap gap-2 text-xs font-bold text-slate-500'>
          <span className='rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-violet-700'>{screenedCount} AI screened</span>
          <span className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5'>{pendingCount} awaiting decision</span>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          {compareList.length >= 2 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className='cursor-pointer rounded-lg bg-emerald-600 text-white px-3 py-2 text-xs font-extrabold transition-all hover:bg-emerald-700 shadow-sm flex items-center gap-1'
            >
              <BarChart3 size={14} /> Compare ({compareList.length})
            </button>
          )}
          <button
            onClick={() => setSortBy('date')}
            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              sortBy === 'date'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Applied Date
          </button>
          <button
            onClick={() => setSortBy('aiScore')}
            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
              sortBy === 'aiScore'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Rank by Resume Match
          </button>
          <div className='w-[1px] h-6 bg-gray-200 mx-1'></div>
          <button
            onClick={() => fetchCompanyJobs()}
            className='cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-all'
            title='Refresh Applications'
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className='premium-panel overflow-hidden rounded-[1.5rem]'>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-left'>
            <thead>
              <tr className='border-b border-gray-200 bg-gray-50 text-xs font-extrabold uppercase tracking-[0.12em] text-gray-500'>
                <th className='px-6 py-4 max-sm:hidden'>#</th>
                <th className='px-6 py-4'>Candidate</th>
                <th className='px-6 py-4 max-sm:hidden'>Applied For</th>
                <th className='px-6 py-4 max-sm:hidden'>Links</th>
                <th className='px-6 py-4'>Resume</th>
                <th className='px-6 py-4'>Status / Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {sortedApplicants.map((applicant, index) => (
                  <React.Fragment key={applicant._id || index}>
                    <tr className='group transition-colors hover:bg-blue-50/30'>
                      <td className='px-6 py-5 font-semibold text-gray-400 max-sm:hidden'>{index + 1}</td>
                      <td className='px-6 py-5'>
                        <div className='flex items-center gap-3'>
                          <img className='h-11 w-11 rounded-full border border-gray-200 object-cover p-0.5 shadow-sm' src={applicant.userId.image} alt='' />
                          <div>
                            <div className='flex items-center gap-2 flex-wrap'>
                              <span className='font-extrabold text-gray-950'>{applicant.userId.name}</span>
                              {applicant.aiScore !== undefined && (
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black tracking-wider ${
                                  applicant.aiScore >= 75
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : applicant.aiScore >= 50
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {applicant.aiScore}% Match
                                </span>
                              )}
                            </div>
                            <div className='mt-1 text-xs text-gray-500 sm:hidden'>{applicant.jobId.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-5 max-sm:hidden'>
                        <div>
                          <div className='text-sm font-bold text-gray-800'>{applicant.jobId.title}</div>
                          <div className='mt-0.5 text-xs text-gray-400'>{applicant.jobId.location}</div>
                        </div>
                      </td>
                      {/* Social Links */}
                      <td className='px-6 py-5 max-sm:hidden'>
                        <div className='flex items-center gap-2'>
                          {applicant.userId?.links?.github && (
                            <a
                              href={applicant.userId.links.github}
                              target='_blank'
                              rel='noreferrer'
                              title='GitHub Profile'
                              className='flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all hover:border-gray-400 hover:bg-gray-100 hover:text-gray-900'
                            >
                              <Github size={13} />
                            </a>
                          )}
                          {applicant.userId?.links?.linkedin && (
                            <a
                              href={applicant.userId.links.linkedin}
                              target='_blank'
                              rel='noreferrer'
                              title='LinkedIn Profile'
                              className='flex h-7 w-7 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 hover:text-blue-700'
                            >
                              <Linkedin size={13} />
                            </a>
                          )}
                          {applicant.userId?.links?.portfolio && (
                            <a
                              href={applicant.userId.links.portfolio}
                              target='_blank'
                              rel='noreferrer'
                              title='Portfolio'
                              className='flex h-7 w-7 items-center justify-center rounded-lg border border-violet-100 bg-violet-50 text-violet-600 transition-all hover:bg-violet-100 hover:text-violet-700'
                            >
                              <Globe size={13} />
                            </a>
                          )}
                          {!applicant.userId?.links?.github && !applicant.userId?.links?.linkedin && !applicant.userId?.links?.portfolio && (
                            <span className='text-[10px] font-semibold text-gray-400'>-</span>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        {applicant.userId.resume ? (
                          <a className='inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-700 transition-all hover:bg-blue-100' href={applicant.userId.resume} target='_blank' rel='noreferrer'>
                            View <img className='w-3' src={assets.resume_download_icon} alt='' />
                          </a>
                        ) : (
                          <span className='rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-400'>No Resume</span>
                        )}
                      </td>
                      <td className='px-6 py-5'>
                        <div className='flex items-center gap-2'>
                          {applicant.status === 'Pending' ? (
                            <>
                              <button onClick={() => changeJobStatus(applicant._id, 'Accepted')} className='rounded-xl border border-green-100 bg-green-50 p-2 text-green-700 transition-all hover:bg-green-100 cursor-pointer' title='Accept'>
                                <Check size={17} />
                              </button>
                              <button onClick={() => changeJobStatus(applicant._id, 'Rejected')} className='rounded-xl border border-red-100 bg-red-50 p-2 text-red-700 transition-all hover:bg-red-100 cursor-pointer' title='Reject'>
                                <X size={17} />
                              </button>
                            </>
                          ) : (
                            <>
                              <span className={`status-chip ${applicant.status === 'Accepted' ? 'border border-green-100 bg-green-50 text-green-700' : 'border border-red-100 bg-red-50 text-red-700'}`}>
                                {applicant.status}
                              </span>
                              <button onClick={() => changeJobStatus(applicant._id, 'Pending')} className='text-gray-400 transition-colors hover:text-blue-600 cursor-pointer' title='Reset'>
                                <RotateCcw size={16} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setExpandedId(expandedId === applicant._id ? null : applicant._id)}
                            className={`rounded-xl border p-2 transition-all cursor-pointer ${
                              expandedId === applicant._id
                                ? 'border-indigo-200 bg-indigo-500 text-white'
                                : 'border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                            }`}
                            title='AI Recruiter Review'
                          >
                            <Sparkles size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable AI Screener Section */}
                    {expandedId === applicant._id && (
                      <tr className='bg-slate-50/50 backdrop-blur-sm'>
                        <td colSpan={6} className='px-6 py-5 border-t border-b border-indigo-50/60'>
                          <div className='space-y-4'>
                            <div className='flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3'>
                              <div className='flex items-center gap-3'>
                                <span className='flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 text-sm font-bold'>
                                  <BrainCircuit size={15} />
                                </span>
                                <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
                                  AI Screening Assessment
                                </span>
                              </div>

                              <div className='flex items-center gap-2'>
                                <button
                                  onClick={() => handleScreenApplication(applicant._id)}
                                  disabled={screeningIds[applicant._id]}
                                  className='cursor-pointer text-xs font-extrabold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 disabled:opacity-50'
                                >
                                  {screeningIds[applicant._id] ? (
                                    <span>Screening Application...</span>
                                  ) : applicant.aiScore !== undefined ? (
                                    <span className='inline-flex items-center gap-1'><RefreshCw size={13} /> Re-run screening</span>
                                  ) : (
                                    <span className='inline-flex items-center gap-1'><Sparkles size={13} /> Run AI screening</span>
                                  )}
                                </button>
                              </div>
                            </div>

                            {screeningIds[applicant._id] ? (
                              <div className='flex flex-col items-center justify-center py-6 space-y-2'>
                                <div className='h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600'></div>
                                <p className='text-xs font-bold text-indigo-600 animate-pulse'>Comparing resume to job details...</p>
                              </div>
                            ) : applicant.aiScore !== undefined ? (
                              <div className='grid gap-5 md:grid-cols-[1fr_2fr]'>
                                {/* Left details - Score & TL;DR */}
                                <div className='space-y-3 border-b border-gray-100 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-5'>
                                  <div className='flex items-center gap-2.5'>
                                    <span className={`rounded-lg px-2.5 py-1 text-xs font-black shadow-sm ${
                                      applicant.aiScore >= 75
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : applicant.aiScore >= 50
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                    }`}>
                                      {applicant.aiScore}% Resume Match
                                    </span>
                                  </div>
                                  <div className='rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm'>
                                    <h4 className='text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5'>Resume TL;DR</h4>
                                    <p className='text-xs text-gray-600 leading-relaxed'>{applicant.aiSummary}</p>
                                  </div>
                                </div>

                                {/* Right details - Tailored Questions */}
                                <div className='space-y-2.5'>
                                  <h4 className='text-[10px] font-bold uppercase tracking-wider text-gray-400'>Tailored Interview Questions</h4>
                                  {applicant.aiQuestions?.length > 0 ? (
                                    <ul className='space-y-3'>
                                      {applicant.aiQuestions.map((q, idx) => {
                                        const answerKey = `${applicant._id}-${idx}`
                                        const isRevealed = revealedAnswers[answerKey]
                                        const hasAnswer = applicant.aiAnswers?.[idx]
                                        return (
                                          <li key={idx} className='text-xs text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden'>
                                            <div className='flex items-start gap-2.5 p-3'>
                                              <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded bg-indigo-50 text-indigo-600 font-extrabold text-[10px]'>
                                                {idx + 1}
                                              </span>
                                              <span className='flex-1 leading-relaxed'>{q}</span>
                                              {hasAnswer && (
                                                <button
                                                  onClick={() => toggleAnswer(applicant._id, idx)}
                                                  className={`shrink-0 rounded-lg p-1.5 transition-all cursor-pointer ${
                                                    isRevealed
                                                      ? 'bg-violet-100 text-violet-700'
                                                      : 'bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-600'
                                                  }`}
                                                >
                                                  {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                                                </button>
                                              )}
                                            </div>
                                            {isRevealed && hasAnswer && (
                                              <div className='mx-3 mb-3 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2.5'>
                                                <p className='mb-1 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-violet-500'><Lightbulb size={12} /> Ideal answer</p>
                                                <p className='text-xs text-violet-800 leading-relaxed'>{applicant.aiAnswers[idx]}</p>
                                              </div>
                                            )}
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  ) : (
                                    <p className='text-xs text-gray-500 font-semibold'>No questions generated.</p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className='text-center py-6 border border-dashed border-gray-200 rounded-xl'>
                                <p className='text-xs text-gray-400 font-semibold mb-3'>This application hasn't been screened with AI yet.</p>
                                <button
                                  onClick={() => handleScreenApplication(applicant._id)}
                                  disabled={screeningIds[applicant._id]}
                                  className='premium-button px-4 py-2.5 text-[10px] cursor-pointer'
                                >
                                  <Sparkles size={13} /> Run AI screening
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const RecruiterStat = ({ icon, label, value, tone = 'blue' }) => {
  const styles = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700'
  }[tone]

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${styles}`}>
      <div className='flex items-center justify-between'>
        {React.cloneElement(icon, { size: 18 })}
        <span className='text-2xl font-semibold'>{value}</span>
      </div>
      <p className='mt-3 text-[10px] font-bold uppercase tracking-[0.14em]'>{label}</p>
    </div>
  )
}

const RecruiterLoading = ({ label }) => (
  <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4'>
    <Loader />
    <p className='text-xs font-bold uppercase tracking-[0.14em] text-slate-400'>{label}</p>
  </div>
)

export default ViewApplications
