import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Database,
  Lock,
  LogOut,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  UserCheck
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const CACHE_KEY = 'insiderjobs-admin-dashboard-cache'
const rowsPerPage = 10

const emptyBundle = {
  stats: {
    totalCompanies: 0,
    pendingVerifications: 0,
    totalJobs: 0,
    totalApplications: 0
  },
  companies: [],
  reportedJobs: [],
  jobs: [],
  analytics: []
}

const App = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null)
  const cachedBundle = readCachedBundle()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(Boolean(cachedBundle))
  const [lastSyncedAt, setLastSyncedAt] = useState(cachedBundle?.cachedAt || null)

  const [stats, setStats] = useState(cachedBundle?.stats || emptyBundle.stats)
  const [companies, setCompanies] = useState(cachedBundle?.companies || [])
  const [reportedJobs, setReportedJobs] = useState(cachedBundle?.reportedJobs || [])
  const [allJobs, setAllJobs] = useState(cachedBundle?.jobs || [])
  const [analyticsData, setAnalyticsData] = useState(cachedBundle?.analytics || [])

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('workspaces')
  const [pageCompanies, setPageCompanies] = useState(1)
  const [pageJobs, setPageJobs] = useState(1)
  const [pageReported, setPageReported] = useState(1)

  useEffect(() => {
    setPageCompanies(1)
    setPageJobs(1)
    setPageReported(1)
  }, [searchQuery, activeTab])

  const persistBundle = (bundle) => {
    const next = { ...bundle, cachedAt: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(next))
    setLastSyncedAt(next.cachedAt)
  }

  const applyBundle = (bundle) => {
    setStats(bundle.stats || emptyBundle.stats)
    setCompanies(bundle.companies || [])
    setReportedJobs(bundle.reportedJobs || [])
    setAllJobs(bundle.jobs || [])
    setAnalyticsData(bundle.analytics || [])
    setHasLoadedOnce(true)
    persistBundle(bundle)
  }

  const fetchDashboardBundle = async ({ silent = false } = {}) => {
    if (!adminToken) return
    if (!silent) setIsRefreshing(true)
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard-bundle`, {
        headers: { token: adminToken }
      })
      if (data.success) {
        applyBundle(data)
      } else if (!silent) {
        toast.error(data.message || 'Unable to load dashboard data')
      }
    } catch (error) {
      if (!silent) toast.error(error.message)
      console.error(error)
    } finally {
      if (!silent) setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (!adminToken) return
    fetchDashboardBundle({ silent: hasLoadedOnce })
    const interval = setInterval(() => fetchDashboardBundle({ silent: true }), 45000)
    return () => clearInterval(interval)
  }, [adminToken])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password })
      if (data.success) {
        setAdminToken(data.token)
        localStorage.setItem('adminToken', data.token)
        toast.success('Admin access granted')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    setAdminToken(null)
    localStorage.removeItem('adminToken')
    toast.info('Logged out of admin console')
  }

  const refreshAll = async () => {
    await fetchDashboardBundle()
    toast.success('Dashboard refreshed')
  }

  const toggleVerification = async (companyId, currentStatus) => {
    const nextStatus = !currentStatus
    setCompanies(prev => prev.map(company => company._id === companyId ? { ...company, isVerified: nextStatus, isEmailVerified: nextStatus || company.isEmailVerified } : company))
    setStats(prev => ({
      ...prev,
      pendingVerifications: Math.max(0, prev.pendingVerifications + (nextStatus ? -1 : 1))
    }))

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/verify`,
        { id: companyId, isVerified: nextStatus },
        { headers: { token: adminToken } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchDashboardBundle({ silent: true })
      } else {
        toast.error(data.message)
        fetchDashboardBundle({ silent: true })
      }
    } catch (error) {
      toast.error(error.message)
      fetchDashboardBundle({ silent: true })
    }
  }

  const dismissReports = async (jobId) => {
    setReportedJobs(prev => prev.filter(job => job._id !== jobId))
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/dismiss-report`,
        { id: jobId },
        { headers: { token: adminToken } }
      )
      if (data.success) toast.success(data.message)
      else toast.error(data.message)
      fetchDashboardBundle({ silent: true })
    } catch (error) {
      toast.error(error.message)
      fetchDashboardBundle({ silent: true })
    }
  }

  const handleDeleteJob = async (jobId) => {
    setAllJobs(prev => prev.filter(job => job._id !== jobId))
    setReportedJobs(prev => prev.filter(job => job._id !== jobId))
    setStats(prev => ({ ...prev, totalJobs: Math.max(0, prev.totalJobs - 1) }))

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/delete-job`,
        { id: jobId },
        { headers: { token: adminToken } }
      )
      if (data.success) toast.success(data.message)
      else toast.error(data.message)
      fetchDashboardBundle({ silent: true })
    } catch (error) {
      toast.error(error.message)
      fetchDashboardBundle({ silent: true })
    }
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredCompanies = useMemo(() => companies.filter(company =>
    company.name?.toLowerCase().includes(normalizedQuery) ||
    company.email?.toLowerCase().includes(normalizedQuery) ||
    company.recruiterName?.toLowerCase().includes(normalizedQuery)
  ), [companies, normalizedQuery])

  const filteredJobs = useMemo(() => allJobs.filter(job =>
    job.title?.toLowerCase().includes(normalizedQuery) ||
    job.category?.toLowerCase().includes(normalizedQuery) ||
    job.location?.toLowerCase().includes(normalizedQuery) ||
    job.companyId?.name?.toLowerCase().includes(normalizedQuery)
  ), [allJobs, normalizedQuery])

  const filteredReportedJobs = useMemo(() => reportedJobs.filter(job =>
    job.title?.toLowerCase().includes(normalizedQuery) ||
    job.companyId?.name?.toLowerCase().includes(normalizedQuery) ||
    job.reports?.some(report => report.reason?.toLowerCase().includes(normalizedQuery))
  ), [reportedJobs, normalizedQuery])

  const paginatedCompanies = useMemo(() => paginate(filteredCompanies, pageCompanies), [filteredCompanies, pageCompanies])
  const paginatedJobs = useMemo(() => paginate(filteredJobs, pageJobs), [filteredJobs, pageJobs])
  const paginatedReported = useMemo(() => paginate(filteredReportedJobs, pageReported), [filteredReportedJobs, pageReported])

  if (!adminToken) {
    return (
      <div className='admin-shell relative flex min-h-screen items-center justify-center overflow-hidden p-4 text-slate-950'>
        <ToastContainer theme='light' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.16),transparent_28rem),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.14),transparent_26rem)]' />
        <form onSubmit={handleLogin} className='relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.14)]'>
          <div className='mb-8'>
            <div className='mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)]'>
              <ShieldAlert size={27} />
            </div>
            <p className='admin-kicker'>InsiderJobs Admin</p>
            <h1 className='mt-2 text-3xl font-semibold tracking-tight'>Operations console</h1>
            <p className='mt-2 text-sm leading-6 text-slate-500'>Sign in to review workspaces, postings, reports, and platform health.</p>
          </div>

          <div className='space-y-4'>
            <Field icon={<Mail />} type='email' placeholder='Admin email' value={email} onChange={setEmail} />
            <Field icon={<Lock />} type='password' placeholder='Password' value={password} onChange={setPassword} />
            <button type='submit' disabled={loginLoading} className='admin-primary w-full py-3.5'>
              {loginLoading ? 'Authenticating...' : 'Access console'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className='admin-shell min-h-screen text-slate-950'>
      <ToastContainer theme='light' />

      <aside className='fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white/92 px-4 py-5 shadow-[12px_0_40px_rgba(15,23,42,0.05)] backdrop-blur-xl lg:block'>
        <div className='mb-7 flex items-center gap-3 px-2'>
          <div className='grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white'>IJ</div>
          <div>
            <p className='text-sm font-bold tracking-tight'>InsiderJobs</p>
            <p className='text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400'>Admin OS</p>
          </div>
        </div>

        <nav className='space-y-2'>
          <AdminNavButton active={activeTab === 'workspaces'} icon={<Building2 />} label='Workspaces' count={companies.length} onClick={() => setActiveTab('workspaces')} />
          <AdminNavButton active={activeTab === 'active-postings'} icon={<BriefcaseBusiness />} label='Active postings' count={allJobs.length} onClick={() => setActiveTab('active-postings')} />
          <AdminNavButton active={activeTab === 'reported-jobs'} icon={<AlertTriangle />} label='Reported queue' count={reportedJobs.length} danger onClick={() => setActiveTab('reported-jobs')} />
        </nav>

        <div className='mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4'>
          <p className='flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-700'>
            <Database size={14} /> Data cache
          </p>
          <p className='mt-2 text-sm leading-6 text-slate-600'>
            {lastSyncedAt ? `Visible immediately. Synced ${formatSyncedAt(lastSyncedAt)}.` : 'Waiting for first dashboard sync.'}
          </p>
        </div>
      </aside>

      <div className='lg:pl-72'>
        <header className='sticky top-0 z-30 border-b border-slate-200 bg-white/88 backdrop-blur-xl'>
          <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4'>
            <div>
              <p className='admin-kicker'>Platform operations</p>
              <h1 className='mt-1 text-xl font-semibold tracking-tight md:text-2xl'>Admin operations</h1>
            </div>

            <div className='flex items-center gap-2'>
              <button onClick={refreshAll} disabled={isRefreshing} className='admin-secondary'>
                <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
                {isRefreshing ? 'Syncing' : 'Refresh'}
              </button>
              <button onClick={handleLogout} className='admin-secondary'>
                <LogOut size={15} /> Logout
              </button>
            </div>
          </div>
        </header>

        <main className='mx-auto max-w-7xl px-5 py-7'>
          <section className='mb-6 grid gap-4 xl:grid-cols-[1fr_380px]'>
            <div className='admin-hero'>
              <div>
                <p className='admin-kicker'>Live moderation</p>
                <h2 className='mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl'>
                  Review the platform without waiting on cold dashboards.
                </h2>
                <p className='mt-4 max-w-2xl text-sm leading-7 text-slate-600'>Cached data appears instantly, then the console quietly revalidates companies, jobs, reports, and analytics from the admin bundle endpoint.</p>
              </div>
              <div className='mt-7 grid gap-3 sm:grid-cols-4'>
                <HeroMetric icon={<Building2 />} label='Companies' value={stats.totalCompanies} />
                <HeroMetric icon={<ShieldAlert />} label='Pending' value={stats.pendingVerifications} tone='amber' />
                <HeroMetric icon={<BriefcaseBusiness />} label='Postings' value={stats.totalJobs} tone='emerald' />
                <HeroMetric icon={<UserCheck />} label='Applications' value={stats.totalApplications} tone='cyan' />
              </div>
            </div>

            <div className='admin-panel p-5'>
              <div className='mb-4 flex items-center justify-between'>
                <div>
                  <p className='admin-kicker'>7-day activity</p>
                  <h3 className='mt-1 text-lg font-semibold tracking-tight'>Platform movement</h3>
                </div>
                <BarChart3 className='text-blue-600' size={21} />
              </div>
              <div className='h-56'>
                {analyticsData.length ? (
                  <ResponsiveContainer width='100%' height='100%'>
                    <AreaChart data={analyticsData} margin={{ top: 10, right: 8, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id='adminJobs' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%' stopColor='#059669' stopOpacity={0.26} />
                          <stop offset='95%' stopColor='#059669' stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id='adminApps' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%' stopColor='#2563eb' stopOpacity={0.26} />
                          <stop offset='95%' stopColor='#2563eb' stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' />
                      <XAxis dataKey='date' stroke='#64748b' fontSize={10} tickLine={false} />
                      <YAxis stroke='#64748b' fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 18px 40px rgba(15,23,42,0.12)' }} />
                      <Area type='monotone' dataKey='jobs' name='Jobs posted' stroke='#059669' fill='url(#adminJobs)' strokeWidth={2.4} />
                      <Area type='monotone' dataKey='applications' name='Applications' stroke='#2563eb' fill='url(#adminApps)' strokeWidth={2.4} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <SkeletonBlock label='Loading analytics' />
                )}
              </div>
            </div>
          </section>

          <section className='admin-panel overflow-hidden'>
            <div className='border-b border-slate-200 p-5'>
              <div className='flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between'>
                <div>
                  <p className='admin-kicker'>{tabMeta[activeTab].eyebrow}</p>
                  <h2 className='mt-1 text-2xl font-semibold tracking-tight'>{tabMeta[activeTab].title}</h2>
                  <p className='mt-1 text-sm text-slate-500'>{tabMeta[activeTab].description}</p>
                </div>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                  <div className='flex min-w-72 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5'>
                    <Search size={17} className='text-slate-400' />
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search records...' className='w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400' />
                  </div>
                  <div className='flex rounded-2xl border border-slate-200 bg-slate-50 p-1 lg:hidden'>
                    {Object.entries(tabMeta).map(([key, item]) => (
                      <button key={key} onClick={() => setActiveTab(key)} className={`rounded-xl px-3 py-2 text-xs font-bold ${activeTab === key ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                        {item.short}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {!hasLoadedOnce ? (
              <TableSkeleton />
            ) : activeTab === 'workspaces' ? (
              <WorkspaceTable rows={paginatedCompanies} total={filteredCompanies.length} page={pageCompanies} setPage={setPageCompanies} onToggle={toggleVerification} />
            ) : activeTab === 'active-postings' ? (
              <JobsTable rows={paginatedJobs} total={filteredJobs.length} page={pageJobs} setPage={setPageJobs} onDelete={handleDeleteJob} />
            ) : (
              <ReportsTable rows={paginatedReported} total={filteredReportedJobs.length} page={pageReported} setPage={setPageReported} onDismiss={dismissReports} onDelete={handleDeleteJob} />
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

const readCachedBundle = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const paginate = (items, page) => {
  const start = (page - 1) * rowsPerPage
  return items.slice(start, start + rowsPerPage)
}

const formatSyncedAt = (time) => {
  const seconds = Math.max(1, Math.round((Date.now() - time) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.round(seconds / 60)
  return `${minutes}m ago`
}

const tabMeta = {
  workspaces: {
    eyebrow: 'Workspace governance',
    title: 'Recruiter workspaces',
    short: 'Companies',
    description: 'Approve verified hiring teams and inspect recruiter identity signals.'
  },
  'active-postings': {
    eyebrow: 'Posting moderation',
    title: 'Active job inventory',
    short: 'Jobs',
    description: 'Review live listings, company ownership, location, category, and stale content.'
  },
  'reported-jobs': {
    eyebrow: 'Trust and safety',
    title: 'Reported listings queue',
    short: 'Reports',
    description: 'Resolve listings flagged by candidates for fraud, inactivity, or inaccurate details.'
  }
}

const Field = ({ icon, type, placeholder, value, onChange }) => (
  <label className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus-within:border-blue-400 focus-within:bg-white'>
    {React.cloneElement(icon, { size: 18, className: 'text-slate-400' })}
    <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required className='w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400' />
  </label>
)

const AdminNavButton = ({ active, icon, label, count, danger = false, onClick }) => (
  <button onClick={onClick} className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm font-bold transition ${active ? 'bg-slate-950 text-white shadow-[0_16px_35px_rgba(15,23,42,0.2)]' : 'text-slate-600 hover:bg-slate-100'}`}>
    <span className='flex items-center gap-3'>
      {React.cloneElement(icon, { size: 18, className: active ? 'text-blue-200' : danger ? 'text-rose-500' : 'text-slate-500' })}
      {label}
    </span>
    <span className={`rounded-full px-2 py-0.5 text-xs ${active ? 'bg-white/12 text-white' : danger ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
  </button>
)

const HeroMetric = ({ icon, label, value, tone = 'blue' }) => {
  const tones = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    cyan: 'border-cyan-100 bg-cyan-50 text-cyan-700'
  }

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${tones[tone]}`}>
      <div className='mb-3 flex items-center justify-between'>
        {React.cloneElement(icon, { size: 18 })}
        <span className='text-2xl font-semibold'>{value}</span>
      </div>
      <p className='text-[10px] font-bold uppercase tracking-[0.14em]'>{label}</p>
    </div>
  )
}

const StatusBadge = ({ verified }) => verified ? (
  <span className='admin-badge bg-emerald-50 text-emerald-700 ring-emerald-100'><CheckCircle2 size={13} /> Verified</span>
) : (
  <span className='admin-badge bg-amber-50 text-amber-700 ring-amber-100'><ShieldAlert size={13} /> Pending</span>
)

const WorkspaceTable = ({ rows, total, page, setPage, onToggle }) => (
  <DataTable
    total={total}
    page={page}
    setPage={setPage}
    columns={['Workspace', 'Recruiter', 'Domain status', 'Action']}
    empty='No workspace profiles match your search.'
  >
    {rows.map(company => (
      <tr key={company._id} className='admin-row'>
        <td className='admin-cell'>
          <div className='flex items-center gap-3'>
            <img src={company.image} alt={company.name} className='h-10 w-10 rounded-xl border border-slate-200 bg-white object-contain p-1' />
            <div>
              <p className='font-bold text-slate-950'>{company.name}</p>
              <p className='text-xs text-slate-500'>{company.email}</p>
            </div>
          </div>
        </td>
        <td className='admin-cell'>
          <p className='font-semibold text-slate-800'>{company.recruiterName || 'Not provided'}</p>
          {company.linkedin ? (
            <a href={company.linkedin.startsWith('http') ? company.linkedin : `https://${company.linkedin}`} target='_blank' rel='noopener noreferrer' className='mt-1 inline-flex items-center gap-1 text-xs font-bold text-blue-600'>
              LinkedIn <ArrowUpRight size={12} />
            </a>
          ) : <p className='text-xs text-slate-400'>No LinkedIn attached</p>}
        </td>
        <td className='admin-cell'><StatusBadge verified={company.isVerified} /></td>
        <td className='admin-cell text-right'>
          <button onClick={() => onToggle(company._id, company.isVerified)} className={`admin-action ${company.isVerified ? 'admin-action-danger' : 'admin-action-success'}`}>
            {company.isVerified ? 'Revoke' : 'Approve'}
          </button>
        </td>
      </tr>
    ))}
  </DataTable>
)

const JobsTable = ({ rows, total, page, setPage, onDelete }) => (
  <DataTable total={total} page={page} setPage={setPage} columns={['Posting', 'Signals', 'Listed', 'Action']} empty='No active postings match your search.'>
    {rows.map(job => (
      <tr key={job._id} className='admin-row'>
        <td className='admin-cell'>
          <div className='flex items-center gap-3'>
            {job.companyId?.image ? <img src={job.companyId.image} alt='' className='h-10 w-10 rounded-xl border border-slate-200 bg-white object-contain p-1' /> : <div className='grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-xs font-black'>HQ</div>}
            <div>
              <p className='font-bold text-slate-950'>{job.title}</p>
              <p className='text-xs text-slate-500'>{job.companyId?.name || 'Unknown company'}</p>
            </div>
          </div>
        </td>
        <td className='admin-cell'>
          <div className='flex flex-wrap gap-2'>
            <SignalChip icon={<MapPin />} label={job.location || 'No location'} />
            <SignalChip icon={<Tag />} label={job.category || 'Uncategorized'} />
          </div>
        </td>
        <td className='admin-cell text-slate-600'>{formatDate(job.date)}</td>
        <td className='admin-cell text-right'>
          <button onClick={() => onDelete(job._id)} className='admin-action admin-action-danger'><Trash2 size={13} /> Delete</button>
        </td>
      </tr>
    ))}
  </DataTable>
)

const ReportsTable = ({ rows, total, page, setPage, onDismiss, onDelete }) => (
  <DataTable total={total} page={page} setPage={setPage} columns={['Reported listing', 'Details', 'Candidate reports', 'Actions']} empty='No reported listings in the queue.'>
    {rows.map(job => (
      <tr key={job._id} className='admin-row'>
        <td className='admin-cell align-top'>
          <p className='font-bold text-slate-950'>{job.title}</p>
          <p className='mt-1 text-xs text-slate-500'>{job.companyId?.name || 'Unknown company'}</p>
        </td>
        <td className='admin-cell align-top'>
          <div className='flex flex-wrap gap-2'>
            <SignalChip icon={<MapPin />} label={job.location || 'No location'} />
            <SignalChip icon={<Tag />} label={job.category || 'Uncategorized'} />
          </div>
        </td>
        <td className='admin-cell align-top'>
          <div className='space-y-2'>
            {job.reports?.map((report, index) => (
              <div key={index} className='rounded-xl border border-rose-100 bg-rose-50 p-3'>
                <p className='text-xs font-bold text-rose-700'>{report.reason}</p>
                <p className='mt-1 text-[10px] font-semibold text-rose-500'>Reporter: {report.userId}</p>
              </div>
            ))}
          </div>
        </td>
        <td className='admin-cell align-top text-right'>
          <div className='flex justify-end gap-2'>
            <button onClick={() => onDismiss(job._id)} className='admin-action'>Dismiss</button>
            <button onClick={() => onDelete(job._id)} className='admin-action admin-action-danger'><Trash2 size={13} /> Delete</button>
          </div>
        </td>
      </tr>
    ))}
  </DataTable>
)

const DataTable = ({ columns, children, total, page, setPage, empty }) => {
  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage))
  const hasRows = React.Children.count(children) > 0

  return (
    <>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[850px] text-left text-sm'>
          <thead>
            <tr className='border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400'>
              {columns.map(column => <th key={column} className='px-5 py-4'>{column}</th>)}
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {hasRows ? children : (
              <tr>
                <td colSpan={columns.length} className='px-5 py-16 text-center text-sm font-semibold text-slate-500'>{empty}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {total > rowsPerPage && (
        <div className='flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm'>
          <p className='font-semibold text-slate-500'>Page {page} of {pageCount}</p>
          <div className='flex gap-2'>
            <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1} className='admin-page-button'>Previous</button>
            <button onClick={() => setPage(prev => Math.min(prev + 1, pageCount))} disabled={page >= pageCount} className='admin-page-button'>Next</button>
          </div>
        </div>
      )}
    </>
  )
}

const SignalChip = ({ icon, label }) => (
  <span className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600'>
    {React.cloneElement(icon, { size: 12, className: 'text-slate-400' })}
    {label}
  </span>
)

const SkeletonBlock = ({ label }) => (
  <div className='grid h-full place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50'>
    <p className='text-sm font-bold text-slate-400'>{label}</p>
  </div>
)

const TableSkeleton = () => (
  <div className='space-y-3 p-5'>
    {[0, 1, 2, 3, 4].map(item => (
      <div key={item} className='h-16 animate-pulse rounded-2xl bg-slate-100' />
    ))}
  </div>
)

const formatDate = (date) => {
  if (!date) return 'Unknown'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default App
