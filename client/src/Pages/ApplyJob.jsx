import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loader from '../LoaderFront/Loader'
import Navbar from '../components/Navbar'
import kConvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BrainCircuit, Briefcase, CalendarClock, Flag, Gauge, MapPin, ShieldCheck, Sparkles, Users, X } from 'lucide-react'

const activityConfig = {
  active: {
    label: 'Active hiring',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
    pulse: true
  },
  slow: {
    label: 'Slow activity',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
    dot: 'bg-amber-500'
  },
  stale: {
    label: 'Likely stale',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
    dot: 'bg-rose-500'
  }
}

const ApplyJob = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [jobData, setjobData] = useState(null)
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [submittingReport, setSubmittingReport] = useState(false)
  const { jobs, backendUrl, userData, userToken, setShowUserLogin, userApplications, fetchUserApplications } = useContext(AppContext)

  const [atsReport, setAtsReport] = useState(null)
  const [isAuditing, setIsAuditing] = useState(false)

  const [tailoredData, setTailoredData] = useState(null)
  const [isTailoring, setIsTailoring] = useState(false)
  const [copiedLetter, setCopiedLetter] = useState(false)

  const runAtsAudit = async () => {
    setIsAuditing(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/users/ats-audit/${jobData._id}`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      if (data.success) {
        setAtsReport(data.audit)
        toast.success("ATS Audit complete!")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsAuditing(false)
    }
  }

  const runAutoTailor = async () => {
    setIsTailoring(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/users/ats-tailor/${jobData._id}`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      if (data.success) {
        setTailoredData(data.tailoredData)
        toast.success("Generated tailored bullets & cover letter!")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsTailoring(false)
    }
  }

  const submitReport = async () => {
    setSubmittingReport(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/${jobData._id}/report`, {
        reason: reportReason,
        userId: userData ? userData._id : 'Anonymous'
      })
      if (data.success) {
        toast.success(data.message)
        setShowReportModal(false)
        setReportReason('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmittingReport(false)
    }
  }

  const fetchjob = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`)
      if (data.success) {
        setjobData(data.job)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const applyHandler = async () => {
    try {
      if (!userToken) return setShowUserLogin(true)
      if (!userData) return toast.error('Login to apply for jobs')
      if (!userData.resume) {
        navigate('/applications')
        return toast.error('Upload Resume to Apply')
      }

      const token = userToken
      const { data } = await axios.post(
        backendUrl + '/api/users/apply',
        { jobId: jobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        fetchUserApplications()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some(item => item.jobId?._id === jobData._id)
    setIsAlreadyApplied(hasApplied)
  }

  useEffect(() => {
    fetchjob()
  }, [id, jobs])

  useEffect(() => {
    if (userApplications.length > 0 && jobData) {
      checkAlreadyApplied()
    }
  }, [jobData, userApplications, id])

  return jobData ? (
    <div className='min-h-screen ij-shell'>
      <Navbar />
      <main className='ij-container py-10'>
        <section className='premium-card mb-8 rounded-[1.35rem] p-6 md:p-8'>
          <div className='flex flex-col justify-between gap-8 md:flex-row md:items-center'>
            <div className='flex flex-col items-center gap-5 text-center md:flex-row md:text-left'>
              <div className='flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-200 bg-white p-4 shadow-sm'>
                <img className='max-h-14 object-contain' src={jobData.companyId.image} alt={jobData.companyId.name} />
              </div>
              <div>
                <p className='section-kicker mb-2'>{jobData.companyId.name}</p>
                <h1 className='max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl'>{jobData.title}</h1>
                <div className='mt-4 flex flex-wrap justify-center gap-3 text-sm font-semibold text-slate-600 md:justify-start'>
                  <Info icon={<Briefcase />} text={jobData.companyId.name} />
                  <Info icon={<MapPin />} text={jobData.location} />
                  <Info icon={<Users />} text={jobData.level} />
                  <Info icon={<CalendarClock />} text={`Posted ${moment(jobData.date).fromNow()}`} />
                  
                  {(jobData.hiringActivity || 'stale') === 'active' && (
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700 shadow-sm'>
                      <span className='relative flex h-2 w-2'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                        <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500'></span>
                      </span>
                      <span className='text-xs font-bold uppercase tracking-wider'>Active Hiring</span>
                    </span>
                  )}
                  {(jobData.hiringActivity || 'stale') === 'slow' && (
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-700 shadow-sm'>
                      <span className='h-2 w-2 rounded-full bg-amber-500'></span>
                      <span className='text-xs font-bold uppercase tracking-wider'>Slow Activity</span>
                    </span>
                  )}
                  {(jobData.hiringActivity || 'stale') === 'stale' && (
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-rose-700 shadow-sm'>
                      <span className='h-2 w-2 rounded-full bg-rose-500'></span>
                      <span className='text-xs font-bold uppercase tracking-wider'>Likely Stale</span>
                    </span>
                  )}

                  {jobData.companyId?.hasApplicants ? (
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-700 shadow-sm'>
                      <span className='text-blue-500 font-bold'>✓</span>
                      <span className='text-xs font-bold'>{jobData.companyId.responseRate}% Response Rate | {jobData.companyId.averageDecisionDays}d Decisions</span>
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-indigo-700 shadow-sm'>
                      <span className='text-indigo-500'>★</span>
                      <span className='text-xs font-bold'>Highly Active Workspace</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className='relative overflow-hidden rounded-[1.15rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-cyan-50/40 p-4 text-slate-950 shadow-[0_22px_60px_rgba(37,99,235,0.12)] md:w-80'>
              <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent' />
              <div className='relative'>
                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <p className='text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700'>Role match</p>
                    <p className='mt-1 text-sm text-slate-600'>Decision readiness</p>
                  </div>
                  <ScoreRing score={94} />
                </div>
                <div className='mt-5 grid grid-cols-3 gap-2 text-center'>
                  <SignalPill label='Role' value='High' />
                  <SignalPill label='Resume' value={userData?.resume ? 'Ready' : 'Needs PDF'} />
                  <SignalPill label='Speed' value={jobData.companyId?.averageDecisionDays ? `${jobData.companyId.averageDecisionDays}d` : 'Live'} />
                </div>
              </div>
              <button onClick={applyHandler} className={`relative mt-5 w-full px-8 py-4 ${isAlreadyApplied ? 'rounded-xl bg-slate-200 font-bold text-slate-500' : 'premium-button cursor-pointer'}`}>
                {isAlreadyApplied ? 'Already applied' : 'Apply now'}
              </button>
              <p className='relative mt-3 text-sm font-semibold text-slate-600'>CTC: {kConvert.convertTo(jobData.salary)}</p>
            </div>
          </div>
          <div className='mt-8 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-3'>
            <DecisionMetric icon={<Gauge />} label='Role match' value='Excellent' detail='Role level and location are aligned.' tone='blue' />
            <DecisionMetric icon={<BrainCircuit />} label='Resume match' value={userData?.resume ? 'Ready to analyze' : 'Resume needed'} detail='Run the ATS audit before applying.' tone='violet' />
            <DecisionMetric icon={<ShieldCheck />} label='Company signal' value={jobData.companyId?.hasApplicants ? `${jobData.companyId.responseRate}% response` : 'Verified workspace'} detail='Hiring activity and response data.' tone='emerald' />
          </div>
        </section>

        <div className='grid gap-8 lg:grid-cols-[1fr_360px]'>
          <div className='space-y-8'>
            <article className='premium-panel rounded-[1.15rem] p-6 md:p-8'>
              <div className='mb-6 flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start'>
                <div>
                  <p className='section-kicker'>Role briefing</p>
                  <h2 className='mt-2 text-2xl font-semibold tracking-tight text-slate-950'>Overview and requirements</h2>
                  <p className='mt-2 text-sm leading-6 text-slate-600'>Use this page as a decision workspace, not just a job description.</p>
                </div>
                <span className='inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700'>
                  <Sparkles size={14} /> AI guidance available
                </span>
              </div>
              <div className='rich-text prose max-w-none text-slate-700' dangerouslySetInnerHTML={{ __html: jobData.description }} />
              <div className='mt-10 flex flex-wrap items-center gap-4'>
                <button onClick={applyHandler} className={`px-8 py-3.5 ${isAlreadyApplied ? 'rounded-xl bg-slate-200 font-bold text-slate-500' : 'premium-button cursor-pointer'}`}>
                  {isAlreadyApplied ? 'Already applied' : 'Apply now'}
                </button>
                <button 
                  type='button'
                  onClick={() => setShowReportModal(true)} 
                  className='cursor-pointer rounded-xl border border-rose-200 px-6 py-3.5 text-rose-600 font-bold hover:bg-rose-50 transition-all active:scale-95 text-sm flex items-center gap-1.5'
                >
                  🚩 Report Listing
                </button>
              </div>
            </article>

            {/* AI ATS Resume Auditor Card */}
            <div className='premium-panel rounded-[1.5rem] p-6 md:p-8 border border-gray-100 bg-white/50 backdrop-blur-md shadow-sm transition-all duration-300'>
              <div className='mb-6 flex items-center justify-between border-b border-gray-100 pb-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 shadow-sm'>
                    <span className='font-bold text-lg'>✨</span>
                  </div>
                  <div>
                    <h2 className='text-lg font-extrabold text-gray-950'>ATS Resume Match Auditor</h2>
                    <p className='text-xs text-gray-500'>Compare your resume against this job description in real-time.</p>
                  </div>
                </div>
              </div>

              {!userToken ? (
                <div className='text-center py-6'>
                  <p className='text-sm text-gray-500 font-semibold mb-4'>Log in as a candidate to audit your resume compatibility.</p>
                  <button onClick={() => setShowUserLogin(true)} className='premium-button px-6 py-3 text-xs'>
                    Candidate Login
                  </button>
                </div>
              ) : !userData?.resume ? (
                <div className='text-center py-6'>
                  <p className='text-sm text-gray-500 font-semibold mb-4'>Please upload your resume first to run the AI ATS Audit.</p>
                  <button onClick={() => navigate('/applications')} className='premium-button px-6 py-3 text-xs'>
                    Upload Resume
                  </button>
                </div>
              ) : isAuditing ? (
                <div className='flex flex-col items-center justify-center py-10 space-y-4'>
                  <div className='h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600'></div>
                  <p className='text-sm font-bold text-indigo-700 animate-pulse'>AI is auditing your resume against requirements...</p>
                </div>
              ) : !atsReport ? (
                <div className='text-center py-6'>
                  <p className='text-sm text-gray-500 font-semibold mb-4'>
                    Click the button below to analyze your ATS match score, view missing skills, and get resume tailoring suggestions.
                  </p>
                  <button onClick={runAtsAudit} className='premium-button px-6 py-3.5 text-xs flex items-center gap-2 mx-auto'>
                    Analyze Resume Match
                  </button>
                </div>
              ) : (
                <div className='space-y-6'>
                  <div className='flex flex-col items-center gap-6 rounded-2xl bg-slate-50/50 border border-slate-100 p-5 sm:flex-row'>
                    {/* Circle Score Gauge */}
                    <div className='relative flex h-24 w-24 shrink-0 items-center justify-center'>
                      <svg className='h-full w-full -rotate-90' viewBox='0 0 100 100'>
                        <circle cx='50' cy='50' r='40' className='stroke-gray-100 fill-none' strokeWidth='8' />
                        <circle
                          cx='50'
                          cy='50'
                          r='40'
                          className={`fill-none transition-all duration-1000 ${
                            atsReport.matchScore >= 75
                              ? 'stroke-emerald-500'
                              : atsReport.matchScore >= 50
                              ? 'stroke-amber-500'
                              : 'stroke-rose-500'
                          }`}
                          strokeWidth='8'
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - atsReport.matchScore / 100)}
                          strokeLinecap='round'
                        />
                      </svg>
                      <span className={`absolute text-xl font-black ${
                        atsReport.matchScore >= 75
                          ? 'text-emerald-600'
                          : atsReport.matchScore >= 50
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}>
                        {atsReport.matchScore}%
                      </span>
                    </div>

                    <div>
                      <h3 className='text-sm font-extrabold text-gray-900'>
                        {atsReport.matchScore >= 75
                          ? 'High Match Potential!'
                          : atsReport.matchScore >= 50
                          ? 'Moderate Match Potential'
                          : 'Low Compatibility Detected'}
                      </h3>
                      <p className='text-xs text-gray-500 mt-1 leading-relaxed max-w-lg'>
                        {atsReport.matchScore >= 75
                          ? 'Your resume is highly optimized for this role. You stand a great chance of passing the automated screening.'
                          : atsReport.matchScore >= 50
                          ? 'You satisfy many core requirements, but adding some of the missing skills or updating your resume bullets could significantly boost your visibility.'
                          : 'Consider optimizing your resume using the suggestions below to match the job criteria before applying.'}
                      </p>
                    </div>
                  </div>

                  <div className='grid gap-6 md:grid-cols-[1fr_2fr]'>
                    {/* Missing Skills */}
                    <div className='space-y-4 border-b border-gray-100 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6'>
                      <h3 className='text-xs font-bold uppercase tracking-wider text-gray-400'>Missing Key Skills</h3>
                      {atsReport.missingSkills?.length > 0 ? (
                        <div className='flex flex-wrap gap-1.5'>
                          {atsReport.missingSkills.map((skill, index) => (
                            <span key={index} className='rounded-lg bg-rose-50 border border-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700 flex items-center gap-1'>
                              ⚠️ {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className='text-xs font-bold text-emerald-600 flex items-center gap-1'>
                          ✓ No critical missing skills!
                        </p>
                      )}
                    </div>

                    {/* Optimization Suggestions */}
                    <div className='space-y-4'>
                      <h3 className='text-xs font-bold uppercase tracking-wider text-gray-400'>ATS Tailoring Suggestions</h3>
                      {atsReport.tailoringSuggestions?.length > 0 ? (
                        <ul className='space-y-2.5'>
                          {atsReport.tailoringSuggestions.map((suggestion, index) => (
                            <li key={index} className='flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed rounded-xl bg-slate-50/50 border border-slate-100 p-3'>
                              <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-black text-[10px]'>
                                {index + 1}
                              </span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className='text-xs text-gray-500 font-semibold'>No tailoring suggestions required.</p>
                      )}
                    </div>
                  </div>

                  <div className='pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3'>
                    <button
                      onClick={runAutoTailor}
                      disabled={isTailoring}
                      className='cursor-pointer text-xs font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5'
                    >
                      {isTailoring ? '⚡ Generating AI Tailoring...' : '🪄 Auto-Tailor Resume & Cover Letter'}
                    </button>
                    <button onClick={runAtsAudit} className='cursor-pointer text-xs font-extrabold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1'>
                      🔄 Re-run AI Audit
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Auto-Tailored Content Box */}
            {tailoredData && (
              <div className='premium-panel rounded-[1.5rem] p-6 md:p-8 border border-blue-100 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 shadow-sm space-y-6'>
                <div className='flex items-center justify-between border-b border-blue-100 pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-sm'>
                      🪄
                    </div>
                    <div>
                      <h3 className='text-lg font-extrabold text-gray-950'>Tailored Resume & Cover Letter</h3>
                      <p className='text-xs text-gray-500'>Customized specifically for {jobData.companyId?.name || 'this posting'}</p>
                    </div>
                  </div>
                </div>

                {/* Value Proposition */}
                {tailoredData.valueProposition && (
                  <div className='p-4 rounded-xl bg-white border border-blue-100 shadow-sm'>
                    <span className='text-[10px] font-extrabold uppercase tracking-wider text-blue-600'>1-Sentence Value Hook</span>
                    <p className='text-xs font-bold text-gray-800 mt-1 leading-relaxed'>{tailoredData.valueProposition}</p>
                  </div>
                )}

                {/* Tailored Bullets */}
                {tailoredData.tailoredBullets?.length > 0 && (
                  <div>
                    <h4 className='text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-3'>High-Impact Resume Bullets</h4>
                    <ul className='space-y-2.5'>
                      {tailoredData.tailoredBullets.map((bullet, idx) => (
                        <li key={idx} className='flex items-start justify-between gap-3 p-3 rounded-xl bg-white border border-gray-100 text-xs text-gray-700 leading-relaxed shadow-sm'>
                          <span>• {bullet}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(bullet)
                              toast.success("Bullet copied to clipboard!")
                            }}
                            className='text-blue-600 hover:text-blue-700 text-[11px] font-bold shrink-0 cursor-pointer'
                          >
                            Copy
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Personalized Cover Letter */}
                {tailoredData.coverLetter && (
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <h4 className='text-xs font-extrabold uppercase tracking-wider text-gray-700'>Tailored Cover Letter</h4>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(tailoredData.coverLetter)
                          setCopiedLetter(true)
                          toast.success("Cover letter copied!")
                          setTimeout(() => setCopiedLetter(false), 2000)
                        }}
                        className='px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-blue-600 hover:bg-gray-50 transition-all cursor-pointer shadow-sm'
                      >
                        {copiedLetter ? '✓ Copied' : '📋 Copy Letter'}
                      </button>
                    </div>
                    <div className='p-4 rounded-xl bg-white border border-gray-100 text-xs text-gray-700 leading-relaxed font-sans whitespace-pre-line shadow-sm'>
                      {tailoredData.coverLetter}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <aside>
            <div className='sticky top-24 space-y-6'>
              <CompanySignalCard jobData={jobData} />

              {/* Company Info Sidebar Card */}
              <div className='hidden premium-panel rounded-[1.5rem] p-6 border border-gray-100 bg-white/50 backdrop-blur-md shadow-sm'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 p-2 shadow-sm'>
                    <img className='h-10 w-10 object-contain' src={jobData.companyId.image} alt={jobData.companyId.name} />
                  </div>
                  <div>
                    <h3 className='text-lg font-extrabold text-gray-950'>{jobData.companyId.name}</h3>
                    <p className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>Verified Workspace</p>
                  </div>
                </div>

                <div className='space-y-3 pt-3 border-t border-gray-100'>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-500 font-semibold'>Hiring Status:</span>
                    {(jobData.hiringActivity || 'stale') === 'active' && (
                      <span className='inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider'>
                        <span className='relative flex h-1.5 w-1.5'>
                          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                          <span className='relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500'></span>
                        </span>
                        Active Hiring
                      </span>
                    )}
                    {(jobData.hiringActivity || 'stale') === 'slow' && (
                      <span className='inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 uppercase tracking-wider'>
                        <span className='h-1.5 w-1.5 rounded-full bg-amber-500'></span>
                        Slow Activity
                      </span>
                    )}
                    {(jobData.hiringActivity || 'stale') === 'stale' && (
                      <span className='inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase tracking-wider'>
                        <span className='h-1.5 w-1.5 rounded-full bg-rose-500'></span>
                        Likely Stale
                      </span>
                    )}
                  </div>

                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-500 font-semibold'>Response Rate:</span>
                    {jobData.companyId.hasApplicants ? (
                      <span className='font-extrabold text-blue-600'>{jobData.companyId.responseRate}%</span>
                    ) : (
                      <span className='font-extrabold text-indigo-600'>★ Highly Active</span>
                    )}
                  </div>

                  {jobData.companyId.hasApplicants && (
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-gray-500 font-semibold'>Avg. Decision Time:</span>
                      <span className='font-extrabold text-blue-600'>{jobData.companyId.averageDecisionDays} days</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className='mb-4 text-xl font-extrabold text-gray-950'>More jobs from {jobData.companyId.name}</h2>
                <div className='space-y-5'>
                  {jobs.filter(job => job._id !== jobData._id && job.companyId._id === jobData.companyId._id).filter(job => {
                    const appliedJobsIds = new Set(userApplications.map(app => app.jobId && app.jobId._id))
                    return !appliedJobsIds.has(job._id)
                  }).slice(0, 4).map((job, index) => <JobCard key={index} job={job} />)}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Reported Jobs Modal */}
        {showReportModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm'>
            <div className='relative w-full max-w-md overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-7 shadow-2xl'>
              <button
                type='button'
                onClick={() => setShowReportModal(false)}
                className='absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer'
              >
                <X size={16} />
              </button>
              
              <div className='mb-6'>
                <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold mb-3'>🚩</span>
                <h3 className='text-lg font-extrabold text-gray-950'>Report Job Listing</h3>
                <p className='text-xs text-gray-500 mt-1'>Help us keep the InsiderJobs workspace clean and verified.</p>
              </div>

              <div className='space-y-2.5 mb-6'>
                {['Ghost Job (Recruiter inactive / No response)', 'Fake / Scam Posting', 'Inaccurate Location / CTC Details', 'Job already filled / Closed'].map((reason) => (
                  <button
                    key={reason}
                    type='button'
                    onClick={() => setReportReason(reason)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      reportReason === reason
                        ? 'border-rose-500 bg-rose-50/50 text-rose-700'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{reason}</span>
                    {reportReason === reason && <span className='h-2 w-2 rounded-full bg-rose-500'></span>}
                  </button>
                ))}
              </div>

              <button
                type='button'
                onClick={submitReport}
                disabled={submittingReport || !reportReason}
                className='w-full rounded-xl bg-rose-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-rose-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer'
              >
                {submittingReport ? 'Submitting Report...' : 'Submit Report'}
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  ) : (
    <div className='flex min-h-screen items-center justify-center'>
      <Loader />
    </div>
  )
}

const Info = ({ icon, text }) => (
  <span className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5'>
    {React.cloneElement(icon, { size: 15, className: 'text-blue-600' })}
    {text}
  </span>
)

const ScoreRing = ({ score }) => (
  <div className='relative grid h-20 w-20 place-items-center rounded-full shadow-sm' style={{ background: `conic-gradient(#2563eb ${score * 3.6}deg, #dbeafe 0deg)` }}>
    <div className='grid h-[62px] w-[62px] place-items-center rounded-full bg-white ring-1 ring-blue-100'>
      <span className='text-2xl font-semibold tracking-tight text-slate-950'>{score}</span>
    </div>
  </div>
)

const SignalPill = ({ label, value }) => (
  <div className='rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm'>
    <p className='text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400'>{label}</p>
    <p className='mt-1 truncate text-xs font-bold text-slate-950'>{value}</p>
  </div>
)

const DecisionMetric = ({ icon, label, value, detail, tone = 'blue' }) => {
  const toneStyles = {
    blue: 'from-blue-50 to-white text-blue-600 border-blue-100',
    violet: 'from-violet-50 to-white text-violet-600 border-violet-100',
    emerald: 'from-emerald-50 to-white text-emerald-600 border-emerald-100'
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 ${toneStyles[tone]}`}>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400'>{label}</p>
          <p className='mt-2 text-base font-bold text-slate-950'>{value}</p>
        </div>
        <div className='rounded-xl bg-white p-2 shadow-sm'>
          {React.cloneElement(icon, { size: 17 })}
        </div>
      </div>
      <p className='mt-3 text-xs leading-5 text-slate-600'>{detail}</p>
    </div>
  )
}

const CompanySignalCard = ({ jobData }) => {
  const activity = activityConfig[jobData.hiringActivity || 'stale'] || activityConfig.stale
  const responseValue = jobData.companyId.hasApplicants ? `${jobData.companyId.responseRate}%` : 'High'
  const decisionValue = jobData.companyId.hasApplicants ? `${jobData.companyId.averageDecisionDays} days` : 'Fast signal'

  return (
    <div className='overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]'>
      <div className='border-b border-slate-200 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50/40 p-5'>
        <div className='flex items-center gap-4'>
          <div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm'>
            <img className='h-10 w-10 object-contain' src={jobData.companyId.image} alt={jobData.companyId.name} />
          </div>
          <div>
            <h3 className='text-lg font-semibold tracking-tight text-slate-950'>{jobData.companyId.name}</h3>
            <p className='mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700'>Verified workspace</p>
          </div>
        </div>
        <div className='mt-5 rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm'>
          <p className='text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400'>Hiring signal</p>
          <div className='mt-2 flex items-center justify-between gap-3'>
            <span className='text-xl font-semibold text-slate-950'>{activity.label}</span>
            <span className='relative flex h-2.5 w-2.5'>
              {activity.pulse && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${activity.dot} opacity-75`} />}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${activity.dot}`} />
            </span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3 p-4'>
        <CompanyMiniStat label='Response' value={responseValue} />
        <CompanyMiniStat label='Decision' value={decisionValue} />
      </div>
      <div className='border-t border-slate-100 px-4 pb-4'>
        <div className='rounded-2xl bg-slate-50 p-4'>
          <p className='text-xs font-bold uppercase tracking-[0.12em] text-slate-400'>What this means</p>
          <p className='mt-2 text-sm leading-6 text-slate-600'>Prioritize this role if the resume match is strong; the company signal suggests this listing is worth a confident application.</p>
        </div>
      </div>
    </div>
  )
}

const CompanyMiniStat = ({ label, value }) => (
  <div className='rounded-2xl border border-slate-200 bg-slate-50 p-3'>
    <p className='text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400'>{label}</p>
    <p className='mt-1 text-lg font-semibold text-slate-950'>{value}</p>
  </div>
)

export default ApplyJob
