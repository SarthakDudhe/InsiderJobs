import React, { useContext, useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Linkedin,
  RefreshCw,
  Target,
  UploadCloud,
  XCircle
} from 'lucide-react'

const CACHE_KEY = 'insiderjobs-career-command-cache'

const Application = () => {
  const navigate = useNavigate()
  const {
    userData,
    userToken,
    backendUrl,
    fetchUserData,
    setUserData,
    userApplications,
    setUserApplications
  } = useContext(AppContext)

  const cached = readCachedCareerData(userToken)
  const [localUser, setLocalUser] = useState(cached?.user || userData || null)
  const [localApplications, setLocalApplications] = useState(cached?.applications || userApplications || [])
  const [lastSyncedAt, setLastSyncedAt] = useState(cached?.cachedAt || null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)
  const [editLinks, setEditLinks] = useState(false)
  const [githubLink, setGithubLink] = useState(cached?.user?.links?.github || '')
  const [linkedinLink, setLinkedinLink] = useState(cached?.user?.links?.linkedin || '')
  const [portfolioLink, setPortfolioLink] = useState(cached?.user?.links?.portfolio || '')

  useEffect(() => {
    if (userData) {
      setLocalUser(userData)
      setGithubLink(userData.links?.github || '')
      setLinkedinLink(userData.links?.linkedin || '')
      setPortfolioLink(userData.links?.portfolio || '')
      persistCareerData(userToken, userData, localApplications)
    }
  }, [userData])

  useEffect(() => {
    if (userApplications?.length || !localApplications.length) {
      setLocalApplications(userApplications || [])
      persistCareerData(userToken, localUser, userApplications || [])
    }
  }, [userApplications])

  const refreshCareerData = async ({ silent = false } = {}) => {
    if (!userToken) return
    if (!silent) setIsRefreshing(true)
    try {
      const [userRes, appsRes] = await Promise.all([
        axios.get(backendUrl + '/api/users/user', { headers: { Authorization: `Bearer ${userToken}` } }),
        axios.get(backendUrl + '/api/users/applications', { headers: { Authorization: `Bearer ${userToken}` } })
      ])

      if (userRes.data.success) {
        setLocalUser(userRes.data.user)
        setUserData(userRes.data.user)
      }
      if (appsRes.data.success) {
        setLocalApplications(appsRes.data.application)
        setUserApplications(appsRes.data.application)
      }
      persistCareerData(userToken, userRes.data.user || localUser, appsRes.data.application || localApplications)
      setLastSyncedAt(Date.now())
    } catch (error) {
      if (!silent) toast.error(error.message)
      console.error(error)
    } finally {
      if (!silent) setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (userToken) {
      refreshCareerData({ silent: Boolean(cached) })
    }
  }, [userToken])

  const metrics = useMemo(() => buildApplicationMetrics(localApplications), [localApplications])
  const profileStrength = useMemo(() => calculateProfileStrength(localUser), [localUser])
  const validApplications = localApplications.filter(item => item.companyId && item.jobId)

  const updateLinks = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/users/update-links',
        { github: githubLink, linkedin: linkedinLink, portfolio: portfolioLink },
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      if (data.success) {
        toast.success(data.message)
        setEditLinks(false)
        await fetchUserData()
        await refreshCareerData({ silent: true })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const updateResume = async () => {
    if (!resume) return toast.error('Select a PDF resume first')
    try {
      const formData = new FormData()
      formData.append('resume', resume)
      const { data } = await axios.post(backendUrl + '/api/users/update-resume', formData, {
        headers: { Authorization: `Bearer ${userToken}` }
      })
      if (data.success) {
        toast.success(data.message)
        await fetchUserData()
        await refreshCareerData({ silent: true })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsEdit(false)
      setResume(null)
    }
  }

  return (
    <div className='min-h-screen ij-shell'>
      <Navbar />
      <main className='ij-container min-h-[65vh] py-8'>
        <section className='mb-8 grid gap-5 lg:grid-cols-[1fr_420px] lg:items-end'>
          <div>
            <p className='section-kicker'>Career command center</p>
            <h1 className='mt-2 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl'>
              Applications, resume, and follow-ups in one operating view.
            </h1>
            <p className='mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base'>
              See your pipeline immediately from cache, then let InsiderJobs refresh profile and application data quietly in the background.
            </p>
          </div>
          <div className='grid gap-3 sm:grid-cols-2'>
            <HeroMetric icon={<Target />} label='Applications' value={metrics.total} />
            <HeroMetric icon={<Clock3 />} label='Pending' value={metrics.pending} tone='amber' />
            <HeroMetric icon={<CheckCircle2 />} label='Accepted' value={metrics.accepted} tone='emerald' />
            <HeroMetric icon={<AlertTriangle />} label='Stale' value={metrics.staleApps.length} tone='rose' />
          </div>
        </section>

        <div className='grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start'>
          <aside className='space-y-6 lg:sticky lg:top-24'>
            <ProfileIdentityCard
              user={localUser}
              profileStrength={profileStrength}
              isEdit={isEdit}
              resume={resume}
              setResume={setResume}
              setIsEdit={setIsEdit}
              updateResume={updateResume}
            />
            <ProfileLinksCard
              user={localUser}
              editLinks={editLinks}
              setEditLinks={setEditLinks}
              githubLink={githubLink}
              linkedinLink={linkedinLink}
              portfolioLink={portfolioLink}
              setGithubLink={setGithubLink}
              setLinkedinLink={setLinkedinLink}
              setPortfolioLink={setPortfolioLink}
              updateLinks={updateLinks}
            />
            <SyncCard lastSyncedAt={lastSyncedAt} isRefreshing={isRefreshing} onRefresh={() => refreshCareerData()} />
          </aside>

          <section className='space-y-6'>
            <PipelineIntelligence metrics={metrics} />
            <ApplicationCRM applications={validApplications} navigate={navigate} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

const ProfileIdentityCard = ({ user, profileStrength, isEdit, resume, setResume, setIsEdit, updateResume }) => (
  <section className='overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.08)]'>
    <div className='border-b border-slate-200 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50/40 p-5'>
      <p className='section-kicker'>Career identity</p>
      <h2 className='mt-2 text-2xl font-semibold tracking-tight text-slate-950'>{user?.name || 'Candidate profile'}</h2>
      <p className='mt-2 text-sm leading-6 text-slate-600'>{user?.email || 'Connect your account to personalize applications.'}</p>
      <div className='mt-5 rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm'>
        <div className='mb-2 flex items-center justify-between text-xs font-bold'>
          <span className='text-slate-500'>Profile strength</span>
          <span className='text-slate-950'>{profileStrength}%</span>
        </div>
        <div className='h-2 overflow-hidden rounded-full bg-slate-200'>
          <div className='h-full rounded-full bg-blue-600' style={{ width: `${profileStrength}%` }} />
        </div>
      </div>
    </div>

    <div className='p-5'>
      <div className='mb-4 flex items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
          <FileText size={21} />
        </div>
        <div>
          <h3 className='font-bold text-slate-950'>Resume workspace</h3>
          <p className='text-sm text-slate-500'>{user?.resume ? 'Ready for AI matching and applications.' : 'Upload a PDF to apply confidently.'}</p>
        </div>
      </div>

      {isEdit || (user && !user.resume) ? (
        <div className='space-y-3'>
          <label htmlFor='resumeUpload' className='flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-blue-200 bg-blue-50/70 px-4 py-4 text-sm font-bold text-blue-700'>
            <span>{resume ? resume.name : 'Select PDF resume'}</span>
            <UploadCloud size={18} />
            <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} type='file' hidden accept='application/pdf' />
          </label>
          <div className='flex gap-2'>
            <button onClick={updateResume} className='premium-button flex-1 px-4 py-3 text-sm'>Save resume</button>
            {isEdit && <button onClick={() => setIsEdit(false)} className='rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600'>Cancel</button>}
          </div>
        </div>
      ) : (
        <div className='flex gap-2'>
          {user?.resume && <a target='_blank' rel='noopener noreferrer' href={user.resume} className='premium-button flex-1 px-4 py-3 text-sm'>View resume</a>}
          <button onClick={() => setIsEdit(true)} className='rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50'>Replace</button>
        </div>
      )}
    </div>
  </section>
)

const ProfileLinksCard = ({ user, editLinks, setEditLinks, githubLink, linkedinLink, portfolioLink, setGithubLink, setLinkedinLink, setPortfolioLink, updateLinks }) => (
  <section className='premium-panel rounded-[1.25rem] p-5'>
    <div className='mb-4 flex items-center justify-between'>
      <div>
        <p className='section-kicker'>Professional links</p>
        <h3 className='mt-1 font-bold text-slate-950'>Career identity signals</h3>
      </div>
      <button onClick={() => setEditLinks(!editLinks)} className='rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50'>
        {editLinks ? 'Cancel' : 'Edit'}
      </button>
    </div>

    {editLinks ? (
      <div className='space-y-2'>
        <ProfileInput icon={<Github />} placeholder='GitHub URL' value={githubLink} onChange={setGithubLink} />
        <ProfileInput icon={<Linkedin />} placeholder='LinkedIn URL' value={linkedinLink} onChange={setLinkedinLink} />
        <ProfileInput icon={<Globe />} placeholder='Portfolio URL' value={portfolioLink} onChange={setPortfolioLink} />
        <button onClick={updateLinks} className='premium-button mt-2 w-full px-4 py-3 text-sm'>Save links</button>
      </div>
    ) : (
      <div className='grid gap-2'>
        <LinkSignal icon={<Github />} label='GitHub' href={user?.links?.github} />
        <LinkSignal icon={<Linkedin />} label='LinkedIn' href={user?.links?.linkedin} />
        <LinkSignal icon={<Globe />} label='Portfolio' href={user?.links?.portfolio} />
      </div>
    )}
  </section>
)

const PipelineIntelligence = ({ metrics }) => (
  <section className='premium-panel rounded-[1.25rem] p-5 md:p-6'>
    <div className='mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
      <div>
        <p className='section-kicker'>Pipeline intelligence</p>
        <h2 className='mt-2 text-2xl font-semibold tracking-tight text-slate-950'>Your hiring funnel at a glance</h2>
        <p className='mt-1 text-sm text-slate-600'>Status, response timing, stale applications, and strongest search patterns.</p>
      </div>
      <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
        <BarChart3 size={22} />
      </div>
    </div>

    <div className='grid gap-3 sm:grid-cols-4'>
      <MetricTile label='Total' value={metrics.total} icon={<Target />} />
      <MetricTile label='Pending' value={metrics.pending} icon={<Clock3 />} tone='amber' />
      <MetricTile label='Accepted' value={metrics.accepted} icon={<CheckCircle2 />} tone='emerald' />
      <MetricTile label='Rejected' value={metrics.rejected} icon={<XCircle />} tone='rose' />
    </div>

    <div className='mt-5 grid gap-5 lg:grid-cols-[220px_1fr]'>
      <div className='rounded-2xl border border-slate-200 bg-slate-50 p-5'>
        <div className='relative mx-auto h-32 w-32 rounded-full' style={{ background: metrics.conicGradient }}>
          <div className='absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white shadow-inner'>
            <span className='text-2xl font-semibold text-slate-950'>{metrics.acceptRate}%</span>
            <span className='text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400'>Success</span>
          </div>
        </div>
        <div className='mt-4 space-y-2 text-xs font-bold text-slate-600'>
          <Legend color='bg-emerald-500' label='Accepted' />
          <Legend color='bg-amber-500' label='Pending' />
          <Legend color='bg-rose-500' label='Rejected' />
        </div>
      </div>

      <div className='grid gap-3 sm:grid-cols-3'>
        <InsightBox label='Top category' value={metrics.topCategory?.[0] || 'Not enough data'} detail={metrics.topCategory ? `${metrics.topCategory[1]} application${metrics.topCategory[1] !== 1 ? 's' : ''}` : 'Apply to more roles'} />
        <InsightBox label='Top location' value={metrics.topLocation?.[0] || 'Not enough data'} detail={metrics.topLocation ? `${metrics.topLocation[1]} application${metrics.topLocation[1] !== 1 ? 's' : ''}` : 'Location signals pending'} />
        <InsightBox label='Avg response' value={metrics.avgResponseDays !== null ? `${metrics.avgResponseDays} days` : 'No decisions yet'} detail={metrics.avgResponseDays !== null ? 'From resolved applications' : 'Keep tracking'} />
      </div>
    </div>

    {metrics.staleApps.length > 0 && (
      <div className='mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4'>
        <div className='flex items-start gap-3'>
          <AlertTriangle className='mt-0.5 text-amber-700' size={18} />
          <div>
            <h3 className='text-sm font-bold text-amber-900'>{metrics.staleApps.length} application{metrics.staleApps.length !== 1 ? 's' : ''} may need follow-up</h3>
            <p className='mt-1 text-sm leading-6 text-amber-800/80'>These pending applications have had no response for 14+ days. Consider following up or prioritizing fresher roles.</p>
          </div>
        </div>
      </div>
    )}
  </section>
)

const ApplicationCRM = ({ applications, navigate }) => (
  <section className='premium-panel overflow-hidden rounded-[1.25rem]'>
    <div className='border-b border-slate-200 p-5 md:p-6'>
      <p className='section-kicker'>Application CRM</p>
      <h2 className='mt-2 text-2xl font-semibold tracking-tight text-slate-950'>Tracked opportunities</h2>
      <p className='mt-1 text-sm text-slate-600'>A clean operational view of every role you have applied to.</p>
    </div>

    {applications.length > 0 ? (
      <div className='divide-y divide-slate-100'>
        {applications.map((application, index) => (
          <ApplicationRow key={application._id || index} application={application} />
        ))}
      </div>
    ) : (
      <div className='flex min-h-[320px] flex-col items-center justify-center p-8 text-center'>
        <div className='mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600'>
          <FileText size={28} />
        </div>
        <h3 className='text-xl font-bold text-slate-950'>No applications tracked yet</h3>
        <p className='mt-2 max-w-md text-sm leading-6 text-slate-600'>Once you apply to roles, this becomes your career CRM with status, timing, and follow-up clarity.</p>
        <button onClick={() => navigate('/opportunities')} className='premium-button mt-6 px-5 py-3 text-sm'>
          Browse opportunities <ArrowRight size={16} />
        </button>
      </div>
    )}
  </section>
)

const ApplicationRow = ({ application }) => {
  const status = application.status || 'Pending'
  const statusStyle = getStatusStyle(status)

  return (
    <article className='grid gap-4 p-5 transition hover:bg-blue-50/30 md:grid-cols-[1fr_auto] md:items-center'>
      <div className='flex items-start gap-4'>
        <img className='h-12 w-12 rounded-2xl border border-slate-200 bg-white object-contain p-2' src={application.companyId.image} alt={application.companyId.name} />
        <div>
          <h3 className='font-bold text-slate-950'>{application.jobId.title}</h3>
          <p className='mt-1 text-sm font-semibold text-slate-600'>{application.companyId.name}</p>
          <div className='mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-600'>
            <span className='rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1'>{application.jobId.location}</span>
            <span className='rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1'>Applied {moment(application.date).format('MMM D, YYYY')}</span>
          </div>
        </div>
      </div>
      <div className='min-w-64'>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle.badge}`}>
          {React.cloneElement(statusStyle.icon, { size: 14 })}
          {status}
        </span>
        <PipelineStatus status={status} />
      </div>
    </article>
  )
}

const PipelineStatus = ({ status }) => {
  const index = status === 'Accepted' ? 4 : status === 'Rejected' ? 3 : 2
  const stages = ['Applied', 'Screened', 'Review', 'Decision', 'Offer']
  return (
    <div className='mt-3 grid grid-cols-5 gap-1'>
      {stages.map((stage, stageIndex) => (
        <div key={stage} className='group'>
          <div className={`h-1.5 rounded-full ${stageIndex <= index ? status === 'Rejected' && stageIndex >= 3 ? 'bg-rose-500' : status === 'Accepted' && stageIndex >= 3 ? 'bg-emerald-500' : 'bg-blue-600' : 'bg-slate-200'}`} />
          <p className='mt-1 hidden text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:block'>{stage}</p>
        </div>
      ))}
    </div>
  )
}

const HeroMetric = ({ icon, label, value, tone = 'blue' }) => {
  const styles = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    rose: 'border-rose-100 bg-rose-50 text-rose-700'
  }[tone]

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${styles}`}>
      <div className='mb-3 flex items-center justify-between'>
        {React.cloneElement(icon, { size: 18 })}
        <span className='text-2xl font-semibold'>{value}</span>
      </div>
      <p className='text-[10px] font-bold uppercase tracking-[0.14em]'>{label}</p>
    </div>
  )
}

const MetricTile = ({ icon, label, value, tone = 'blue' }) => {
  const styles = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    rose: 'border-rose-100 bg-rose-50 text-rose-700'
  }[tone]

  return (
    <div className={`rounded-2xl border p-4 ${styles}`}>
      <div className='flex items-center justify-between'>
        {React.cloneElement(icon, { size: 18 })}
        <span className='text-2xl font-semibold'>{value}</span>
      </div>
      <p className='mt-3 text-[10px] font-bold uppercase tracking-[0.14em]'>{label}</p>
    </div>
  )
}

const SyncCard = ({ lastSyncedAt, isRefreshing, onRefresh }) => (
  <section className='rounded-[1.25rem] border border-blue-100 bg-blue-50/70 p-5'>
    <div className='flex items-center justify-between gap-3'>
      <div>
        <p className='text-xs font-bold uppercase tracking-[0.14em] text-blue-700'>Data visibility</p>
        <p className='mt-2 text-sm leading-6 text-slate-600'>{lastSyncedAt ? `Visible instantly. Synced ${formatSyncedAt(lastSyncedAt)}.` : 'Syncing your career data.'}</p>
      </div>
      <button onClick={onRefresh} className='ij-focus-ring flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm'>
        <RefreshCw size={17} className={isRefreshing ? 'animate-spin' : ''} />
      </button>
    </div>
  </section>
)

const ProfileInput = ({ icon, placeholder, value, onChange }) => (
  <label className='flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5'>
    {React.cloneElement(icon, { size: 16, className: 'text-slate-400' })}
    <input type='url' placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className='w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400' />
  </label>
)

const LinkSignal = ({ icon, label, href }) => (
  <div className='flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3'>
    <span className='flex items-center gap-2 text-sm font-bold text-slate-700'>
      {React.cloneElement(icon, { size: 16, className: 'text-blue-600' })}
      {label}
    </span>
    {href ? (
      <a href={href.startsWith('http') ? href : `https://${href}`} target='_blank' rel='noopener noreferrer' className='text-blue-600'>
        <ExternalLink size={15} />
      </a>
    ) : <span className='text-xs font-bold text-slate-400'>Missing</span>}
  </div>
)

const InsightBox = ({ label, value, detail }) => (
  <div className='rounded-2xl border border-slate-200 bg-white p-4'>
    <p className='text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400'>{label}</p>
    <p className='mt-2 truncate text-base font-bold text-slate-950'>{value}</p>
    <p className='mt-1 text-xs text-slate-500'>{detail}</p>
  </div>
)

const Legend = ({ color, label }) => (
  <div className='flex items-center gap-2'>
    <span className={`h-2 w-2 rounded-full ${color}`} />
    {label}
  </div>
)

const readCachedCareerData = (token) => {
  if (!token) return null
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}:${token}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const persistCareerData = (token, user, applications) => {
  if (!token) return
  try {
    localStorage.setItem(`${CACHE_KEY}:${token}`, JSON.stringify({
      user,
      applications,
      cachedAt: Date.now()
    }))
  } catch {
    // Local cache is only a perceived-performance enhancement.
  }
}

const calculateProfileStrength = (user) => {
  if (!user) return 0
  const checks = [
    Boolean(user.resume),
    Boolean(user.skills?.length),
    Boolean(user.experience?.length),
    Boolean(user.education?.length),
    Boolean(user.links?.github || user.links?.linkedin || user.links?.portfolio)
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

const buildApplicationMetrics = (applications) => {
  const total = applications.length
  const pending = applications.filter(item => item.status === 'Pending').length
  const accepted = applications.filter(item => item.status === 'Accepted').length
  const rejected = applications.filter(item => item.status === 'Rejected').length
  const acceptRate = total ? Math.round((accepted / total) * 100) : 0
  const categoryCount = countBy(applications, item => item.jobId?.category)
  const locationCount = countBy(applications, item => item.jobId?.location)
  const staleApps = applications.filter(item => {
    if (item.status !== 'Pending') return false
    const appliedDate = item.date || new Date(item.createdAt).getTime()
    return (Date.now() - appliedDate) / (1000 * 60 * 60 * 24) >= 14
  })
  const resolved = applications.filter(item => ['Accepted', 'Rejected'].includes(item.status) && item.updatedAt && item.date)
  const avgResponseDays = resolved.length
    ? Math.round(resolved.reduce((sum, item) => sum + ((new Date(item.updatedAt).getTime() - item.date) / (1000 * 60 * 60 * 24)), 0) / resolved.length)
    : null
  const segments = []
  let offset = 0
  if (accepted > 0) { segments.push(`#10b981 ${offset}deg ${offset + (accepted / total) * 360}deg`); offset += (accepted / total) * 360 }
  if (pending > 0) { segments.push(`#f59e0b ${offset}deg ${offset + (pending / total) * 360}deg`); offset += (pending / total) * 360 }
  if (rejected > 0) { segments.push(`#ef4444 ${offset}deg ${offset + (rejected / total) * 360}deg`); offset += (rejected / total) * 360 }

  return {
    total,
    pending,
    accepted,
    rejected,
    acceptRate,
    topCategory: Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0],
    topLocation: Object.entries(locationCount).sort((a, b) => b[1] - a[1])[0],
    staleApps,
    avgResponseDays,
    conicGradient: total ? `conic-gradient(${segments.join(', ')})` : 'conic-gradient(#e2e8f0 0deg 360deg)'
  }
}

const countBy = (items, getter) => items.reduce((acc, item) => {
  const key = getter(item)
  if (key) acc[key] = (acc[key] || 0) + 1
  return acc
}, {})

const getStatusStyle = (status) => {
  if (status === 'Accepted') return { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100', icon: <CheckCircle2 /> }
  if (status === 'Rejected') return { badge: 'bg-rose-50 text-rose-700 border border-rose-100', icon: <XCircle /> }
  return { badge: 'bg-amber-50 text-amber-700 border border-amber-100', icon: <Clock3 /> }
}

const formatSyncedAt = (time) => {
  const seconds = Math.max(1, Math.round((Date.now() - time) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  return `${Math.round(seconds / 60)}m ago`
}

export default Application
