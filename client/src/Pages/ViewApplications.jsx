import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../LoaderFront/Loader'
import { Check, RotateCcw, UsersRound, X, Eye, EyeOff } from 'lucide-react'

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext)
  const [applicants, setApplicants] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [expandedId, setExpandedId] = useState(null)
  const [screeningIds, setScreeningIds] = useState({})
  const [revealedAnswers, setRevealedAnswers] = useState({})

  const toggleAnswer = (applicantId, idx) => {
    const key = `${applicantId}-${idx}`
    setRevealedAnswers(prev => ({ ...prev, [key]: !prev[key] }))
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
        fetchCompanyJobs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setScreeningIds(prev => ({ ...prev, [applicationId]: false }))
    }
  }

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/company/applicants', {
        headers: { token: companyToken }
      })
      if (data.success) {
        setApplicants(data.applications.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeJobStatus = async (id, status) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/company/change-status', { id, status }, { headers: { token: companyToken } })
      if (data.success) {
        fetchCompanyJobs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCompanyJobs()
  }, [companyToken])

  return applicants ? applicants.length === 0 ? (
    <div className='flex h-[70vh] flex-col items-center justify-center text-center'>
      <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm'>
        <UsersRound className='text-blue-600' size={30} />
      </div>
      <p className='text-xl font-extrabold text-gray-950'>No applications yet</p>
      <p className='mt-2 text-gray-500'>Applications for your posted jobs will appear here.</p>
    </div>
  ) : (
    <div className='mx-auto max-w-6xl'>
      <div className='mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <p className='section-kicker'>Candidate review</p>
          <h1 className='mt-2 text-3xl font-extrabold text-gray-950'>Applications</h1>
          <p className='mt-2 text-gray-600'>Review resumes and rank candidates using the AI Recruiter Screener.</p>
        </div>

        {/* Sorting Toggles */}
        <div className='flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm h-fit self-end sm:self-center'>
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
            ✨ Rank by AI Fit Score
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
                <th className='px-6 py-4'>Resume</th>
                <th className='px-6 py-4'>Status / Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {(() => {
                const filteredApplicants = applicants ? applicants.filter(item => item.jobId && item.userId) : [];
                const sortedApplicants = [...filteredApplicants].sort((a, b) => {
                  if (sortBy === 'aiScore') {
                    const scoreA = a.aiScore ?? -1;
                    const scoreB = b.aiScore ?? -1;
                    return scoreB - scoreA;
                  }
                  return 0;
                });

                return sortedApplicants.map((applicant, index) => (
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
                                  {applicant.aiScore}% Fit
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
                            ✨
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable AI Screener Section */}
                    {expandedId === applicant._id && (
                      <tr className='bg-slate-50/50 backdrop-blur-sm'>
                        <td colSpan={5} className='px-6 py-5 border-t border-b border-indigo-50/60'>
                          <div className='space-y-4'>
                            <div className='flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3'>
                              <div className='flex items-center gap-3'>
                                <span className='flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 text-sm font-bold'>
                                  🤖
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
                                    <span>🔄 Re-run Screening</span>
                                  ) : (
                                    <span>✨ Run AI Screening</span>
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
                                      {applicant.aiScore}% Match Score
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
                                                  title={isRevealed ? 'Hide ideal answer' : 'Show ideal answer'}
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
                                                <p className='text-[10px] font-extrabold uppercase tracking-wider text-violet-500 mb-1'>💡 Ideal Answer</p>
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
                                  ✨ Run AI Screening
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <Loader />
    </div>
  )
}

export default ViewApplications
