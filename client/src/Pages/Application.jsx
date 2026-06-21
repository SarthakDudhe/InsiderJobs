import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FileText, UploadCloud, BarChart3, TrendingUp, Clock, AlertTriangle, CheckCircle2, XCircle, Hourglass, Target, ArrowUpRight, ChevronDown, ChevronUp, Folder } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Application = () => {
  const navigate = useNavigate()
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)
  const { userData, userToken, backendUrl, fetchUserData, fetchUserApplications, userApplications } = useContext(AppContext)
  const [editLinks, setEditLinks] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [githubLink, setGithubLink] = useState(userData?.links?.github || '');
  const [linkedinLink, setLinkedinLink] = useState(userData?.links?.linkedin || '');
  const [portfolioLink, setPortfolioLink] = useState(userData?.links?.portfolio || '');

  // Sync state when userData loads/updates
  useEffect(() => {
    setGithubLink(userData?.links?.github || '');
    setLinkedinLink(userData?.links?.linkedin || '');
    setPortfolioLink(userData?.links?.portfolio || '');
  }, [userData]);

  const updateLinks = async () => {
    try {
      const token = userToken;
      const { data } = await axios.post(
        backendUrl + '/api/users/update-links',
        { github: githubLink, linkedin: linkedinLink, portfolio: portfolioLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
        setEditLinks(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateResume = async () => {
    try {
      const formData = new FormData()
      formData.append('resume', resume)

      const token = userToken
      const { data } = await axios.post(backendUrl + '/api/users/update-resume', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        toast.success(data.message)
        await fetchUserData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

    setIsEdit(false)
    setResume(null)
  }

  useEffect(() => {
    if (userToken) {
      fetchUserApplications()
    }
  }, [userToken])

  return (
    <div className='min-h-screen ij-shell'>
      <Navbar />
      <main className='ij-container min-h-[65vh] py-10'>
        <div className='mb-8'>
          <p className='section-kicker'>Career command center</p>
          <h1 className='mt-2 text-3xl font-extrabold text-gray-950 md:text-5xl'>Applications</h1>
          <p className='mt-2 max-w-2xl text-gray-600'>Manage your resume and track every opportunity from submission to decision.</p>
        </div>

        <section className='premium-panel mb-8 rounded-[1.5rem] p-6'>
          <div className='mb-5 flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700'>
              <FileText size={21} />
            </div>
            <div>
              <h2 className='text-xl font-extrabold text-gray-950'>Your Resume</h2>
              <p className='text-sm text-gray-500'>Used by the AI recommender and job applications.</p>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-3'>
            {isEdit || (userData && userData.resume === '') ? (
              <>
                <label className='group flex cursor-pointer items-center' htmlFor='resumeUpload'>
                  <div className='inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-5 py-3 font-bold text-blue-700 transition-colors group-hover:bg-blue-100'>
                    {resume ? resume.name : 'Select PDF Resume'}
                    <UploadCloud size={18} />
                  </div>
                  <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} type='file' hidden accept='application/pdf' />
                </label>
                <button className='rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-green-700 active:scale-95' onClick={updateResume}>
                  Save Changes
                </button>
                {isEdit && <button onClick={() => setIsEdit(false)} className='px-4 font-bold text-gray-500 hover:text-gray-800'>Cancel</button>}
              </>
            ) : (
              <div className='flex items-center gap-3'>
                {userData && userData.resume !== '' && (
                  <a target='_blank' rel='noopener noreferrer' href={userData.resume} className='premium-button px-6 py-3'>
                    View Resume
                  </a>
                )}
                <button onClick={() => setIsEdit(true)} className='rounded-xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50'>
                  Edit Resume
                </button>
              </div>
            )}
          </div>
        </section>

        {userData && (userData.skills?.length > 0 || userData.experience?.length > 0 || userData.education?.length > 0) && (
          <section className='premium-panel mb-8 rounded-[1.5rem] p-6 bg-gradient-to-br from-white via-white to-blue-50/20'>
            <div className='mb-6 flex items-center justify-between border-b border-gray-100 pb-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm'>
                  <span className='font-bold text-lg'>★</span>
                </div>
                <div>
                  <h2 className='text-xl font-extrabold text-gray-950'>AI Developer Profile</h2>
                  <p className='text-sm text-gray-500'>Auto-extracted from your parsed resume.</p>
                </div>
              </div>
              
              {/* Profile Social Links */}
              <div className='flex flex-col items-end gap-2'>
                <div className='flex gap-2'>
                  {userData.links?.github && (
                    <a href={userData.links.github} target='_blank' rel='noopener noreferrer' className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors' title='GitHub'>
                      <svg className='h-4 w-4 fill-current' viewBox='0 0 24 24'><path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/></svg>
                    </a>
                  )}
                  {userData.links?.linkedin && (
                    <a href={userData.links.linkedin} target='_blank' rel='noopener noreferrer' className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 transition-colors' title='LinkedIn'>
                      <svg className='h-4 w-4 fill-current' viewBox='0 0 24 24'><path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'/></svg>
                    </a>
                  )}
                  {userData.links?.portfolio && (
                    <a href={userData.links.portfolio} target='_blank' rel='noopener noreferrer' className='flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-700 hover:bg-purple-100 transition-colors' title='Portfolio'>
                      <Folder size={16} />
                    </a>
                  )}
                </div>
                {/* Edit Links UI */}
                <div className='flex flex-col items-end gap-2'>
                  <button onClick={() => setEditLinks(!editLinks)} className='rounded-xl bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-200'>
                    {editLinks ? 'Cancel' : 'Edit Links'}
                  </button>
                  {editLinks && (
                    <div className='mt-2 flex flex-col gap-2'>
                      <input type="url" placeholder="GitHub URL" value={githubLink} onChange={e => setGithubLink(e.target.value)} className="rounded-lg border border-gray-200 p-2 text-sm" />
                      <input type="url" placeholder="LinkedIn URL" value={linkedinLink} onChange={e => setLinkedinLink(e.target.value)} className="rounded-lg border border-gray-200 p-2 text-sm" />
                      <input type="url" placeholder="Portfolio URL" value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} className="rounded-lg border border-gray-200 p-2 text-sm" />
                      <button onClick={updateLinks} className="mt-1 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">Save Changes</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='grid gap-6 md:grid-cols-[1fr_2fr]'>
              {/* Left Column: Skills */}
              <div className='space-y-4 border-b border-gray-100 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6'>
                <h3 className='text-xs font-bold uppercase tracking-wider text-gray-400'>Technical Skills</h3>
                <div className='flex flex-wrap gap-1.5'>
                  {userData.skills?.map((skill, index) => (
                    <span key={index} className='rounded-lg bg-slate-50 border border-slate-200/60 px-2.5 py-1 text-xs font-semibold text-slate-700'>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Experience and Education */}
              <div className='space-y-6'>
                {/* Experience */}
                {userData.experience?.length > 0 && (
                  <div>
                    <h3 className='mb-3 text-xs font-bold uppercase tracking-wider text-gray-400'>Experience</h3>
                    <div className='space-y-3'>
                      {userData.experience.map((exp, index) => (
                        <div key={index} className='flex items-start justify-between rounded-xl bg-slate-50/50 border border-slate-100 p-3'>
                          <div>
                            <p className='font-bold text-gray-900 text-sm'>{exp.role}</p>
                            <p className='text-xs text-gray-500 mt-0.5'>{exp.company}</p>
                          </div>
                          <span className='rounded-lg bg-blue-50/60 px-2 py-0.5 text-[10px] font-bold text-blue-700'>
                            {exp.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {userData.education?.length > 0 && (
                  <div>
                    <h3 className='mb-3 text-xs font-bold uppercase tracking-wider text-gray-400'>Education</h3>
                    <div className='space-y-3'>
                      {userData.education.map((edu, index) => (
                        <div key={index} className='flex items-start justify-between rounded-xl bg-slate-50/50 border border-slate-100 p-3'>
                          <div>
                            <p className='font-bold text-gray-900 text-sm'>{edu.degree}</p>
                            <p className='text-xs text-gray-500 mt-0.5'>{edu.school}</p>
                          </div>
                          <span className='rounded-lg bg-emerald-50/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700'>
                            {edu.year}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════ APPLICATION INSIGHTS DASHBOARD ═══════════ */}
        {userApplications.length > 0 && (() => {
          const total = userApplications.length
          const pending = userApplications.filter(a => a.status === 'Pending').length
          const accepted = userApplications.filter(a => a.status === 'Accepted').length
          const rejected = userApplications.filter(a => a.status === 'Rejected').length
          const acceptRate = total ? Math.round((accepted / total) * 100) : 0
          const pendingRate = total ? Math.round((pending / total) * 100) : 0
          const rejectedRate = total ? Math.round((rejected / total) * 100) : 0

          // Most applied category
          const categoryCount = {}
          userApplications.forEach(app => {
            if (app.jobId?.category) {
              categoryCount[app.jobId.category] = (categoryCount[app.jobId.category] || 0) + 1
            }
          })
          const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]

          // Most applied location
          const locationCount = {}
          userApplications.forEach(app => {
            if (app.jobId?.location) {
              locationCount[app.jobId.location] = (locationCount[app.jobId.location] || 0) + 1
            }
          })
          const topLocation = Object.entries(locationCount).sort((a, b) => b[1] - a[1])[0]

          // Stale applications (14+ days with no decision)
          const now = Date.now()
          const staleApps = userApplications.filter(a => {
            if (a.status !== 'Pending') return false
            const appliedDate = a.date || new Date(a.createdAt).getTime()
            const daysSince = (now - appliedDate) / (1000 * 60 * 60 * 24)
            return daysSince >= 14
          })

          // Average response time (only for resolved applications)
          const resolvedApps = userApplications.filter(a => (a.status === 'Accepted' || a.status === 'Rejected') && a.updatedAt && a.date)
          let avgResponseDays = null
          if (resolvedApps.length > 0) {
            const totalDays = resolvedApps.reduce((sum, a) => {
              const applied = a.date || new Date(a.createdAt).getTime()
              const resolved = new Date(a.updatedAt).getTime()
              return sum + (resolved - applied) / (1000 * 60 * 60 * 24)
            }, 0)
            avgResponseDays = Math.round(totalDays / resolvedApps.length)
          }

          // Oldest pending application
          const pendingApps = userApplications.filter(a => a.status === 'Pending')
          let oldestPendingDays = 0
          if (pendingApps.length > 0) {
            const oldest = pendingApps.reduce((min, a) => {
              const d = a.date || new Date(a.createdAt).getTime()
              return d < min ? d : min
            }, Infinity)
            oldestPendingDays = Math.round((now - oldest) / (1000 * 60 * 60 * 24))
          }

          // Ring chart math (CSS conic gradient)
          const segments = []
          let offset = 0
          if (accepted > 0) { segments.push(`#22c55e ${offset}deg ${offset + (accepted / total) * 360}deg`); offset += (accepted / total) * 360 }
          if (pending > 0) { segments.push(`#f59e0b ${offset}deg ${offset + (pending / total) * 360}deg`); offset += (pending / total) * 360 }
          if (rejected > 0) { segments.push(`#ef4444 ${offset}deg ${offset + (rejected / total) * 360}deg`); offset += (rejected / total) * 360 }
          const conicGradient = `conic-gradient(${segments.join(', ')})`

          return (
            <section className='premium-panel mb-8 rounded-[1.5rem] overflow-hidden'>
              {/* Header */}
              <button
                onClick={() => setInsightsOpen(!insightsOpen)}
                className='w-full flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50/50 transition-colors'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 text-indigo-700 shadow-sm'>
                    <BarChart3 size={21} />
                  </div>
                  <div className='text-left'>
                    <h2 className='text-xl font-extrabold text-gray-950'>Application Insights</h2>
                    <p className='text-sm text-gray-500'>Your hiring funnel at a glance — {total} application{total !== 1 ? 's' : ''} tracked.</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  {staleApps.length > 0 && (
                    <span className='hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-700 text-[10px] font-bold uppercase tracking-wider'>
                      <AlertTriangle size={12} />
                      {staleApps.length} stale
                    </span>
                  )}
                  <span className='flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-500'>
                    {insightsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </div>
              </button>

              {/* Collapsible Body */}
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${insightsOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className='px-6 pb-6 space-y-6 border-t border-gray-100'>

                  {/* ──── ROW 1: KPI Stat Cards ──── */}
                  <div className='grid grid-cols-2 gap-3 pt-5 sm:grid-cols-4'>
                    {/* Total Applications */}
                    <div className='group relative rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-sm transition-all hover:shadow-md hover:border-blue-100'>
                      <div className='flex items-center justify-between mb-3'>
                        <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
                          <Target size={17} />
                        </span>
                        <ArrowUpRight size={14} className='text-gray-300 group-hover:text-blue-400 transition-colors' />
                      </div>
                      <p className='text-2xl font-black text-gray-950 tracking-tight'>{total}</p>
                      <p className='text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-0.5'>Total Applied</p>
                    </div>

                    {/* Accepted */}
                    <div className='group relative rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-emerald-50/30 p-4 shadow-sm transition-all hover:shadow-md hover:border-emerald-100'>
                      <div className='flex items-center justify-between mb-3'>
                        <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
                          <CheckCircle2 size={17} />
                        </span>
                        <span className='text-[10px] font-black text-emerald-600'>{acceptRate}%</span>
                      </div>
                      <p className='text-2xl font-black text-gray-950 tracking-tight'>{accepted}</p>
                      <p className='text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-0.5'>Accepted</p>
                    </div>

                    {/* Pending */}
                    <div className='group relative rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-amber-50/30 p-4 shadow-sm transition-all hover:shadow-md hover:border-amber-100'>
                      <div className='flex items-center justify-between mb-3'>
                        <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600'>
                          <Hourglass size={17} />
                        </span>
                        <span className='text-[10px] font-black text-amber-600'>{pendingRate}%</span>
                      </div>
                      <p className='text-2xl font-black text-gray-950 tracking-tight'>{pending}</p>
                      <p className='text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-0.5'>Pending</p>
                    </div>

                    {/* Rejected */}
                    <div className='group relative rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-rose-50/30 p-4 shadow-sm transition-all hover:shadow-md hover:border-rose-100'>
                      <div className='flex items-center justify-between mb-3'>
                        <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600'>
                          <XCircle size={17} />
                        </span>
                        <span className='text-[10px] font-black text-rose-600'>{rejectedRate}%</span>
                      </div>
                      <p className='text-2xl font-black text-gray-950 tracking-tight'>{rejected}</p>
                      <p className='text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-0.5'>Rejected</p>
                    </div>
                  </div>

                  {/* ──── ROW 2: Ring Chart + Detailed Insights ──── */}
                  <div className='grid gap-5 md:grid-cols-[200px_1fr]'>
                    {/* Left: Ring chart */}
                    <div className='flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-slate-50/40 p-5 shadow-sm'>
                      <div
                        className='relative h-32 w-32 rounded-full'
                        style={{ background: conicGradient }}
                      >
                        <div className='absolute inset-3 rounded-full bg-white flex flex-col items-center justify-center shadow-inner'>
                          <span className='text-xl font-black text-gray-950'>{acceptRate}%</span>
                          <span className='text-[9px] font-bold uppercase tracking-wider text-gray-400'>Success</span>
                        </div>
                      </div>
                      <div className='mt-4 flex items-center gap-4 text-[10px] font-bold'>
                        <span className='flex items-center gap-1.5'>
                          <span className='h-2 w-2 rounded-full bg-emerald-500'></span>
                          <span className='text-gray-500'>Accepted</span>
                        </span>
                        <span className='flex items-center gap-1.5'>
                          <span className='h-2 w-2 rounded-full bg-amber-500'></span>
                          <span className='text-gray-500'>Pending</span>
                        </span>
                        <span className='flex items-center gap-1.5'>
                          <span className='h-2 w-2 rounded-full bg-rose-500'></span>
                          <span className='text-gray-500'>Rejected</span>
                        </span>
                      </div>
                    </div>

                    {/* Right: Deep Insights */}
                    <div className='space-y-3'>
                      {/* Status funnel bars */}
                      <div className='rounded-2xl border border-gray-100 bg-white p-4 shadow-sm'>
                        <h4 className='text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3'>Application Funnel</h4>
                        <div className='space-y-3'>
                          <div>
                            <div className='flex justify-between items-center mb-1'>
                              <span className='text-xs font-bold text-gray-700'>Pending</span>
                              <span className='text-[10px] font-black text-amber-600'>{pending} of {total}</span>
                            </div>
                            <div className='h-2 w-full rounded-full bg-gray-100 overflow-hidden'>
                              <div className='h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700' style={{ width: `${pendingRate}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <div className='flex justify-between items-center mb-1'>
                              <span className='text-xs font-bold text-gray-700'>Accepted</span>
                              <span className='text-[10px] font-black text-emerald-600'>{accepted} of {total}</span>
                            </div>
                            <div className='h-2 w-full rounded-full bg-gray-100 overflow-hidden'>
                              <div className='h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700' style={{ width: `${acceptRate}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <div className='flex justify-between items-center mb-1'>
                              <span className='text-xs font-bold text-gray-700'>Rejected</span>
                              <span className='text-[10px] font-black text-rose-600'>{rejected} of {total}</span>
                            </div>
                            <div className='h-2 w-full rounded-full bg-gray-100 overflow-hidden'>
                              <div className='h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-700' style={{ width: `${rejectedRate}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Info chips row */}
                      <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                        {/* Top Category */}
                        {topCategory && (
                          <div className='rounded-2xl border border-gray-100 bg-white p-4 shadow-sm'>
                            <div className='flex items-center gap-2 mb-2'>
                              <span className='flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600'>
                                <TrendingUp size={14} />
                              </span>
                              <span className='text-[10px] font-bold uppercase tracking-wider text-gray-400'>Top Category</span>
                            </div>
                            <p className='text-sm font-extrabold text-gray-900 truncate'>{topCategory[0]}</p>
                            <p className='text-[10px] text-gray-400 font-semibold'>{topCategory[1]} application{topCategory[1] !== 1 ? 's' : ''}</p>
                          </div>
                        )}

                        {/* Top Location */}
                        {topLocation && (
                          <div className='rounded-2xl border border-gray-100 bg-white p-4 shadow-sm'>
                            <div className='flex items-center gap-2 mb-2'>
                              <span className='flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600'>
                                <Target size={14} />
                              </span>
                              <span className='text-[10px] font-bold uppercase tracking-wider text-gray-400'>Top Location</span>
                            </div>
                            <p className='text-sm font-extrabold text-gray-900 truncate'>{topLocation[0]}</p>
                            <p className='text-[10px] text-gray-400 font-semibold'>{topLocation[1]} application{topLocation[1] !== 1 ? 's' : ''}</p>
                          </div>
                        )}

                        {/* Avg Response Time */}
                        <div className='rounded-2xl border border-gray-100 bg-white p-4 shadow-sm'>
                          <div className='flex items-center gap-2 mb-2'>
                            <span className='flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                              <Clock size={14} />
                            </span>
                            <span className='text-[10px] font-bold uppercase tracking-wider text-gray-400'>Avg Response</span>
                          </div>
                          {avgResponseDays !== null ? (
                            <>
                              <p className='text-sm font-extrabold text-gray-900'>{avgResponseDays} day{avgResponseDays !== 1 ? 's' : ''}</p>
                              <p className='text-[10px] text-gray-400 font-semibold'>From {resolvedApps.length} resolved</p>
                            </>
                          ) : (
                            <>
                              <p className='text-sm font-extrabold text-gray-500'>—</p>
                              <p className='text-[10px] text-gray-400 font-semibold'>No decisions yet</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ──── ROW 3: Stale Applications Warning ──── */}
                  {staleApps.length > 0 && (
                    <div className='rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50/60 to-orange-50/40 p-5'>
                      <div className='flex items-start gap-3'>
                        <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700'>
                          <AlertTriangle size={17} />
                        </span>
                        <div className='flex-1 min-w-0'>
                          <h4 className='text-sm font-extrabold text-amber-900'>
                            {staleApps.length} application{staleApps.length !== 1 ? 's' : ''} with no response in 14+ days
                          </h4>
                          <p className='text-xs text-amber-700/70 mt-0.5 mb-3'>
                            These applications may be inactive. Consider following up or exploring other opportunities.
                          </p>
                          <div className='flex flex-wrap gap-2'>
                            {staleApps.slice(0, 5).map((app, i) => (
                              <span key={i} className='inline-flex items-center gap-1.5 rounded-lg border border-amber-200/80 bg-white/60 px-2.5 py-1.5 text-[11px] font-bold text-amber-800 backdrop-blur-sm'>
                                <img className='h-4 w-4 rounded object-contain' src={app.companyId?.image} alt='' />
                                {app.jobId?.title?.length > 28 ? app.jobId.title.slice(0, 28) + '…' : app.jobId?.title}
                              </span>
                            ))}
                            {staleApps.length > 5 && (
                              <span className='inline-flex items-center rounded-lg border border-amber-200/80 bg-white/60 px-2.5 py-1.5 text-[11px] font-bold text-amber-600'>
                                +{staleApps.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ──── ROW 4: Quick summary sentence ──── */}
                  <div className='rounded-2xl border border-gray-100 bg-gradient-to-r from-slate-50/80 to-blue-50/40 p-4 flex items-start gap-3'>
                    <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mt-0.5'>
                      <TrendingUp size={15} />
                    </span>
                    <div>
                      <p className='text-xs text-gray-600 leading-relaxed'>
                        <span className='font-extrabold text-gray-900'>Pipeline Summary:</span>{' '}
                        You've applied to <span className='font-extrabold text-blue-600'>{total}</span> job{total !== 1 ? 's' : ''}.{' '}
                        {accepted > 0 && <><span className='font-extrabold text-emerald-600'>{accepted}</span> accepted. </>}
                        {rejected > 0 && <><span className='font-extrabold text-rose-600'>{rejected}</span> rejected. </>}
                        {pending > 0 && <><span className='font-extrabold text-amber-600'>{pending}</span> still awaiting response. </>}
                        {oldestPendingDays > 0 && <>Your oldest pending application is <span className='font-extrabold text-gray-900'>{oldestPendingDays} day{oldestPendingDays !== 1 ? 's' : ''}</span> old.</>}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          )
        })()}

        <section className='premium-panel overflow-hidden rounded-[1.5rem]'>
          <div className='border-b border-gray-200 p-6'>
            <h2 className='text-xl font-extrabold text-gray-950'>Applied Jobs History</h2>
            <p className='mt-1 text-sm text-gray-500'>A clean view of your active hiring pipeline.</p>
          </div>

          <div className='hidden overflow-x-auto md:block'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200 bg-gray-50 text-sm uppercase tracking-[0.12em] text-gray-500'>
                  <th className='px-4 py-4 text-left font-extrabold'>Company</th>
                  <th className='px-4 py-4 text-left font-extrabold'>Position</th>
                  <th className='px-4 py-4 text-left font-extrabold'>Location</th>
                  <th className='px-4 py-4 text-left font-extrabold'>Date Applied</th>
                  <th className='px-4 py-4 text-left font-extrabold'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {userApplications.filter(job => job.companyId && job.jobId).map((job, index) => (
                  <tr key={index} className='transition-colors hover:bg-blue-50/30'>
                    <td className='px-4 py-5'>
                      <div className='flex items-center gap-3'>
                        <img className='h-10 w-10 rounded-xl border border-gray-200 bg-white object-contain p-1' src={job.companyId.image} alt='' />
                        <span className='font-extrabold text-gray-950'>{job.companyId.name}</span>
                      </div>
                    </td>
                    <td className='px-4 py-5 font-bold text-gray-700'>{job.jobId.title}</td>
                    <td className='px-4 py-5 text-gray-500'>{job.jobId.location}</td>
                    <td className='px-4 py-5 text-sm text-gray-500'>{moment(job.date).format('MMM D, YYYY')}</td>
                    <td className='px-4 py-5'>
                      <Status status={job.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='space-y-4 p-4 md:hidden'>
            {userApplications.filter(job => job.companyId && job.jobId).map((job, index) => (
              <div key={index} className='rounded-2xl border border-gray-200 bg-gray-50/70 p-4'>
                <div className='mb-3 flex items-center gap-3'>
                  <img className='h-12 w-12 rounded-xl border border-gray-200 bg-white object-contain p-1' src={job.companyId.image} alt='' />
                  <div>
                    <h3 className='font-extrabold text-gray-950'>{job.jobId.title}</h3>
                    <p className='text-sm text-gray-600'>{job.companyId.name}</p>
                  </div>
                </div>
                <div className='mb-4 grid grid-cols-2 gap-2 text-xs'>
                  <div>
                    <span className='font-bold uppercase tracking-[0.1em] text-gray-400'>Location</span>
                    <p className='font-semibold text-gray-700'>{job.jobId.location}</p>
                  </div>
                  <div className='text-right'>
                    <span className='font-bold uppercase tracking-[0.1em] text-gray-400'>Date</span>
                    <p className='font-semibold text-gray-700'>{moment(job.date).format('ll')}</p>
                  </div>
                </div>
                <div className='flex items-center justify-between border-t border-gray-200 pt-3'>
                  <span className='text-xs font-bold uppercase tracking-[0.12em] text-gray-400'>Status</span>
                  <Status status={job.status} />
                </div>
              </div>
            ))}
          </div>

          {userApplications.length === 0 && (
            <div className='py-20 text-center'>
              <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50'>
                <FileText className='text-blue-600' size={30} />
              </div>
              <p className='font-bold text-gray-500'>No job applications found yet.</p>
              <button onClick={() => navigate('/')} className='mt-4 font-extrabold text-blue-600 hover:underline'>
                Browse latest jobs
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

const Status = ({ status }) => (
  <span className={`status-chip ${status === 'Accepted' ? 'border border-green-100 bg-green-50 text-green-700' : status === 'Rejected' ? 'border border-red-100 bg-red-50 text-red-700' : 'border border-amber-100 bg-amber-50 text-amber-700'}`}>
    {status}
  </span>
)

export default Application
