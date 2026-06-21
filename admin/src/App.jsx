import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Briefcase,
  Building,
  CheckCircle,
  FileText,
  Lock,
  Mail,
  Search,
  ShieldAlert,
  LogOut,
  XCircle,
  AlertTriangle,
  MapPin,
  Tag,
  RefreshCw
} from 'lucide-react'
import logo from './assets/logo.svg'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const App = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null)
  // Separate pagination states for each tab
  const [pageCompanies, setPageCompanies] = useState(1);
  const [pageJobs, setPageJobs] = useState(1);
  const [pageReported, setPageReported] = useState(1);
  const rowsPerPage = 10;

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [stats, setStats] = useState({
    totalCompanies: 0,
    pendingVerifications: 0,
    totalJobs: 0,
    totalApplications: 0
  })
  
  const [companies, setCompanies] = useState([])
  const [reportedJobs, setReportedJobs] = useState([])
  const [allJobs, setAllJobs] = useState([])
  const [analyticsData, setAnalyticsData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('workspaces')

  // Reset page numbers when search query or active tab changes
  useEffect(() => {
    setPageCompanies(1);
    setPageJobs(1);
    setPageReported(1);
  }, [searchQuery, activeTab]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password })
      if (data.success) {
        setAdminToken(data.token)
        localStorage.setItem('adminToken', data.token)
        toast.success('Access Granted. Welcome back Admin.')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle Logout
  const handleLogout = () => {
    setAdminToken(null)
    localStorage.removeItem('adminToken')
    toast.info('Logged out of Admin Portal.')
  }

  // Fetch Dashboard Statistics
  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/stats`, {
        headers: { token: adminToken }
      })
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Fetch Registered Companies
  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/companies`, {
        headers: { token: adminToken }
      })
      if (data.success) {
        setCompanies(data.companies)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Fetch Reported Jobs
  const fetchReportedJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/reported-jobs`, {
        headers: { token: adminToken }
      })
      if (data.success) {
        setReportedJobs(data.reportedJobs)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Fetch All Jobs
  const fetchAllJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/jobs`, {
        headers: { token: adminToken }
      })
      if (data.success) {
        setAllJobs(data.jobs)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Fetch 7-day Analytics Data
  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/analytics`, {
        headers: { token: adminToken }
      })
      if (data.success) {
        setAnalyticsData(data.stats)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Toggle Verification Status
  const toggleVerification = async (companyId, currentStatus) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/verify`,
        { id: companyId, isVerified: !currentStatus },
        { headers: { token: adminToken } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchCompanies()
        fetchStats()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Dismiss Reported Job Flags
  const dismissReports = async (jobId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/dismiss-report`,
        { id: jobId },
        { headers: { token: adminToken } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchReportedJobs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Delete Reported Job Listing
  const handleDeleteJob = async (jobId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/delete-job`,
        { id: jobId },
        { headers: { token: adminToken } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchReportedJobs()
        fetchAllJobs()
        fetchStats()
        fetchAnalytics()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (adminToken) {
      fetchStats()
      fetchCompanies()
      fetchReportedJobs()
      fetchAllJobs()
      fetchAnalytics()
    }
  }, [adminToken])

  // Filtered companies based on search
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filtered jobs based on search
  const filteredJobs = allJobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (job.companyId && job.companyId.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Pagination slices (memoized for performance)
  const paginatedCompanies = useMemo(() => {
    const start = (pageCompanies - 1) * rowsPerPage;
    return filteredCompanies.slice(start, start + rowsPerPage);
  }, [filteredCompanies, pageCompanies, rowsPerPage]);

  const paginatedJobs = useMemo(() => {
    const start = (pageJobs - 1) * rowsPerPage;
    return filteredJobs.slice(start, start + rowsPerPage);
  }, [filteredJobs, pageJobs, rowsPerPage]);

  const paginatedReported = useMemo(() => {
    const start = (pageReported - 1) * rowsPerPage;
    return reportedJobs.slice(start, start + rowsPerPage);
  }, [reportedJobs, pageReported, rowsPerPage]);

  // Login view if unauthenticated
  if (!adminToken) {
    return (
      <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7fb] p-4 font-sans text-slate-950 w-full'>
        <ToastContainer theme="light" />
        <div className='absolute left-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-blue-300/20 blur-3xl' />
        <div className='absolute right-1/4 bottom-1/4 h-[350px] w-[350px] rounded-full bg-cyan-300/20 blur-3xl' />

        <div className='relative w-full max-w-md rounded-3xl border border-slate-200 bg-white/88 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl'>
          <div className='mb-8 text-center'>
            <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]'>
              <ShieldAlert size={28} className='text-white' />
            </div>
            <h1 className='text-2xl font-extrabold tracking-tight'>Control Console</h1>
            <p className='text-xs text-slate-500 mt-2'>Sign in with administrator credentials.</p>
          </div>

          <form onSubmit={handleLogin} className='space-y-4'>
            <div className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus-within:border-blue-500/50 transition-all'>
              <Mail size={18} className='text-slate-400' />
              <input
                type='email'
                placeholder='Admin Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400 text-slate-950'
              />
            </div>

            <div className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus-within:border-blue-500/50 transition-all'>
              <Lock size={18} className='text-slate-400' />
              <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400 text-slate-950'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-98 disabled:opacity-50 cursor-pointer'
            >
              {loading ? 'Authenticating...' : 'Access Console'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#f5f7fb] text-slate-950 font-sans selection:bg-blue-600 selection:text-white w-full'>
      <ToastContainer theme="light" />
      
      {/* Upper Navigation Bar */}
      <header className='sticky top-0 z-40 border-b border-slate-200 bg-white/86 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl'>
        <div className='flex items-center justify-between px-6 py-4 max-w-7xl mx-auto'>
          <div className='flex items-center gap-4'>
            <img className='w-32 opacity-95' src={logo} alt='InsiderJobs' />
            <span className='rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-red-600'>
              HQ Admin Console
            </span>
          </div>

          <button
            onClick={handleLogout}
            className='flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors'
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-6 py-8'>
        
        {/* Metric Cards & Visual Recharts area */}
        <section className='grid gap-6 lg:grid-cols-3 mb-8'>
          
          {/* Recharts Activity Graph */}
          <div className='lg:col-span-2 rounded-3xl border border-slate-200 bg-white/88 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-md flex flex-col justify-between min-h-[300px]'>
            <div>
              <h3 className='text-sm font-black tracking-tight text-slate-950'>7-Day Activity Trends</h3>
              <p className='text-[10px] text-slate-500 mt-0.5'>Monitor daily jobs posted vs. candidate applications submitted.</p>
            </div>
            
            <div className='h-[200px] w-full mt-4'>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '11px', color: '#0f172a', boxShadow: '0 18px 40px rgba(15,23,42,0.12)' }} />
                  <Area type="monotone" dataKey="jobs" name="Jobs Posted" stroke="#10b981" fillOpacity={1} fill="url(#colorJobs)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="applications" name="Applications" stroke="#3b82f6" fillOpacity={1} fill="url(#colorApps)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Core Metric Cards */}
          <div className='flex flex-col gap-4 justify-between'>
            <MetricCard icon={<Building />} title='Total Companies' count={stats.totalCompanies} color='text-blue-400 bg-blue-500/10 border-blue-500/10' />
            <MetricCard icon={<ShieldAlert />} title='Pending Approval' count={stats.pendingVerifications} color='text-amber-400 bg-amber-500/10 border-amber-500/10' highlight={stats.pendingVerifications > 0} />
            <MetricCard icon={<Briefcase />} title='Active Postings' count={stats.totalJobs} color='text-emerald-400 bg-emerald-500/10 border-emerald-500/10' />
          </div>
        </section>

        {/* Tab Selection Row */}
        <div className='flex border-b border-slate-200 mb-6 gap-6'>
          <button
            onClick={() => setActiveTab('workspaces')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'workspaces' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            Workspaces
            {activeTab === 'workspaces' && <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full'></span>}
          </button>
          <button
            onClick={() => setActiveTab('active-postings')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'active-postings' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            Active Postings
            {activeTab === 'active-postings' && <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full'></span>}
          </button>
          <button
            onClick={() => setActiveTab('reported-jobs')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reported-jobs' ? 'text-rose-600' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            Reported Jobs
            {reportedJobs.length > 0 && (
              <span className='h-2 w-2 rounded-full bg-rose-500 animate-pulse'></span>
            )}
            {activeTab === 'reported-jobs' && <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full'></span>}
          </button>
        </div>

        {/* Workspaces Moderation Tab Content */}
        {activeTab === 'workspaces' && (
          <section className='rounded-3xl border border-slate-200 bg-white/88 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6'>
              <div>
                <h2 className='text-lg font-black tracking-tight'>Workspaces Moderation</h2>
                <p className='text-xs text-slate-500 mt-1'>Review recruiter profiles and toggle domain verification state.</p>
              </div>
              
              {/* Actions Box */}
              <div className='flex items-center gap-3 w-full sm:w-auto'>
                <div className='flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 w-full sm:max-w-xs focus-within:border-blue-500/30 transition-all'>
                  <Search size={16} className='text-slate-400' />
                  <input
                    type='text'
                    placeholder='Search by workspace...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='bg-transparent text-xs font-semibold outline-none text-slate-950 w-full placeholder:text-slate-400'
                  />
                </div>
                <button
                  type='button'
                  onClick={fetchCompanies}
                  className='flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm'
                  title='Refresh Workspaces'
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <div className='overflow-x-auto rounded-2xl border border-slate-200 bg-white'>
              <table className='w-full text-left border-collapse text-xs'>
                <thead>
                  <tr className='border-b border-slate-200 bg-slate-50 font-extrabold text-slate-500'>
                    <th className='p-4'>Company</th>
                    <th className='p-4'>Email Domain</th>
                    <th className='p-4'>Recruiter Profile</th>
                    <th className='p-4'>Verification Status</th>
                    <th className='p-4 text-right'>Action</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100'>
                  {paginatedCompanies.length > 0 ? (
                    paginatedCompanies.map((company) => (
                      <tr key={company._id} className='hover:bg-blue-50/40 transition-colors'>
                        <td className='p-4'>
                          <div className='flex items-center gap-3'>
                            <img src={company.image} alt={company.name} className='h-8 w-8 rounded-lg object-contain bg-white p-1' />
                            <span className='font-bold text-slate-950'>{company.name}</span>
                          </div>
                        </td>
                        <td className='p-4 font-semibold text-slate-500'>
                          {company.email}
                        </td>
                        <td className='p-4'>
                          <div className='flex flex-col'>
                            <span className='font-bold text-slate-950'>{company.recruiterName || 'N/A'}</span>
                            {company.linkedin ? (
                              <a href={company.linkedin.startsWith('http') ? company.linkedin : `https://${company.linkedin}`}
                                 target='_blank'
                                 rel='noopener noreferrer'
                                 className='inline-flex items-center gap-0.5 text-[10px] text-blue-500 hover:underline font-semibold mt-0.5 w-fit'>
                                LinkedIn Profile ↗
                              </a>
                            ) : (
                              <span className='text-[10px] text-slate-400'>No LinkedIn</span>
                            )}
                          </div>
                        </td>
                        <td className='p-4'>
                          {company.isVerified ? (
                            <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/10'>
                              <CheckCircle size={10} /> Verified
                            </span>
                          ) : (
                            <span className='inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-400 border border-amber-500/10 animate-pulse'>
                              <ShieldAlert size={10} /> Pending Approval
                            </span>
                          )}
                        </td>
                        <td className='p-4 text-right'>
                          <button type='button' onClick={() => toggleVerification(company._id, company.isVerified)}
                                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all active:scale-95 ${company.isVerified ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/10' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/10'}`}>
                            {company.isVerified ? 'Revoke Approval' : 'Approve Domain'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className='p-8 text-center text-slate-500 font-semibold'>
                        No workspace profiles match your search criteria.
                      </td>
                    </tr>
                  )}
                  {/* Pagination Controls */}
                  {filteredCompanies.length > rowsPerPage && (
                    <tr>
                      <td colSpan={5} className='p-4 flex justify-center space-x-2'>
                        <button onClick={() => setPageCompanies(p => Math.max(p - 1, 1))} disabled={pageCompanies === 1}
                                className='px-3 py-1 border rounded disabled:opacity-50 text-slate-500'>Prev</button>
                        <span className='px-2 text-slate-500 flex items-center'>Page {pageCompanies} of {Math.ceil(filteredCompanies.length / rowsPerPage)}</span>
                        <button onClick={() => setPageCompanies(p => Math.min(p + 1, Math.ceil(filteredCompanies.length / rowsPerPage)))}
                                disabled={pageCompanies >= Math.ceil(filteredCompanies.length / rowsPerPage)}
                                className='px-3 py-1 border rounded disabled:opacity-50 text-slate-500'>Next</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Active Postings Tab Content */}
        {activeTab === 'active-postings' && (
          <section className='rounded-3xl border border-slate-200 bg-white/88 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6'>
              <div>
                <h2 className='text-lg font-black tracking-tight'>Active Postings Moderation</h2>
                <p className='text-xs text-slate-500 mt-1'>Review all active jobs and delete any inappropriate or stale listings.</p>
              </div>
              
              {/* Actions Box */}
              <div className='flex items-center gap-3 w-full sm:w-auto'>
                <div className='flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 w-full sm:max-w-xs focus-within:border-blue-500/30 transition-all'>
                  <Search size={16} className='text-slate-400' />
                  <input
                    type='text'
                    placeholder='Search by job title or company...'
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPageJobs(1); }}
                    className='bg-transparent text-xs font-semibold outline-none text-slate-950 w-full placeholder:text-slate-400'
                  />
                </div>
                <button
                  type='button'
                  onClick={fetchAllJobs}
                  className='flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm'
                  title='Refresh Jobs'
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <div className='overflow-x-auto rounded-2xl border border-slate-200 bg-white'>
              <table className='w-full text-left border-collapse text-xs'>
                <thead>
                  <tr className='border-b border-slate-200 bg-slate-50 font-extrabold text-slate-500'>
                    <th className='p-4'>Job Title & Company</th>
                    <th className='p-4'>Details</th>
                    <th className='p-4'>Listed Date</th>
                    <th className='p-4 text-right'>Action</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100'>
                  {paginatedJobs.length > 0 ? (
                    paginatedJobs.map((job) => (
                      <tr key={job._id} className='hover:bg-blue-50/40 transition-colors'>
                        <td className='p-4'>
                          <div className='flex items-center gap-3'>
                            {job.companyId ? (
                              <img src={job.companyId.image} alt='' className='h-8 w-8 rounded-lg object-contain bg-white p-1' />
                            ) : (
                              <span className='h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center'>HQ</span>
                            )}
                            <div>
                              <p className='font-bold text-slate-950'>{job.title}</p>
                              <p className='text-[10px] text-slate-500 mt-0.5'>{job.companyId ? job.companyId.name : 'Unknown Company'}</p>
                            </div>
                          </div>
                        </td>
                        <td className='p-4 text-slate-500 space-y-1'>
                          <p className='flex items-center gap-1.5'><MapPin size={12} className='text-slate-400' /> {job.location}</p>
                          <p className='flex items-center gap-1.5'><Tag size={12} className='text-slate-400' /> {job.category}</p>
                        </td>
                        <td className='p-4 font-semibold text-slate-500'>
                          {new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className='p-4 text-right'>
                          <button type='button' onClick={() => handleDeleteJob(job._id)}
                                  className='cursor-pointer rounded-lg bg-rose-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-rose-700 active:scale-95 transition-all shadow-sm'>
                            Delete Listing
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className='p-8 text-center text-slate-500 font-semibold'>
                        No active job postings match your search criteria.
                      </td>
                    </tr>
                  )}
                  {/* Pagination Controls */}
                  {filteredJobs.length > rowsPerPage && (
                    <tr>
                      <td colSpan={4} className='p-4 flex justify-center space-x-2'>
                        <button onClick={() => setPageJobs(p => Math.max(p - 1, 1))} disabled={pageJobs === 1}
                                className='px-3 py-1 border rounded disabled:opacity-50 text-slate-500'>Prev</button>
                        <span className='px-2 text-slate-500 flex items-center'>Page {pageJobs} of {Math.ceil(filteredJobs.length / rowsPerPage)}</span>
                        <button onClick={() => setPageJobs(p => Math.min(p + 1, Math.ceil(filteredJobs.length / rowsPerPage)))}
                                disabled={pageJobs >= Math.ceil(filteredJobs.length / rowsPerPage)}
                                className='px-3 py-1 border rounded disabled:opacity-50 text-slate-500'>Next</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Reported Jobs Tab Content */}
        {activeTab === 'reported-jobs' && (
          <section className='rounded-3xl border border-rose-200 bg-white/88 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6'>
              <div>
                <h2 className='text-lg font-black tracking-tight text-rose-400 flex items-center gap-2'>
                  <AlertTriangle size={20} /> Reported Listings Queue
                </h2>
                <p className='text-xs text-slate-500 mt-1'>Audit suspect job listings flagged by candidates for inactivity or scams.</p>
              </div>
              <button
                type='button'
                onClick={fetchReportedJobs}
                className='flex cursor-pointer items-center justify-center rounded-xl border border-rose-200 bg-white p-2.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95 shadow-sm h-fit self-end sm:self-center'
                title='Refresh Reported Jobs'
              >
                <RefreshCw size={16} />
              </button>
            </div>

            <div className='overflow-x-auto rounded-2xl border border-slate-200 bg-white'>
              <table className='w-full text-left border-collapse text-xs'>
                <thead>
                  <tr className='border-b border-slate-200 bg-slate-50 font-extrabold text-slate-500'>
                    <th className='p-4'>Job Title & Company</th>
                    <th className='p-4'>Details</th>
                    <th className='p-4'>Report Reasons</th>
                    <th className='p-4 text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100'>
                  {paginatedReported.length > 0 ? (
                    paginatedReported.map((job) => (
                      <tr key={job._id} className='hover:bg-rose-50/40 transition-colors'>
                        <td className='p-4 align-top'>
                          <div className='flex items-center gap-3'>
                            {job.companyId ? (
                              <img src={job.companyId.image} alt='' className='h-8 w-8 rounded-lg object-contain bg-white p-1' />
                            ) : (
                              <span className='h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center'>HQ</span>
                            )}
                            <div>
                              <p className='font-bold text-slate-950'>{job.title}</p>
                              <p className='text-[10px] text-slate-500 mt-0.5'>{job.companyId ? job.companyId.name : 'Unknown Company'}</p>
                            </div>
                          </div>
                        </td>
                        <td className='p-4 align-top text-slate-500 space-y-1'>
                          <p className='flex items-center gap-1.5'><MapPin size={12} className='text-slate-400' /> {job.location}</p>
                          <p className='flex items-center gap-1.5'><Tag size={12} className='text-slate-400' /> {job.category}</p>
                        </td>
                        <td className='p-4 align-top'>
                          <div className='space-y-1.5'>
                            {job.reports.map((report, idx) => (
                              <div key={idx} className='bg-rose-500/5 border border-rose-500/10 rounded-lg p-2 max-w-sm'>
                                <p className='font-bold text-rose-400 text-[10px]'>Reason: {report.reason}</p>
                                <p className='text-[9px] text-slate-500 mt-0.5'>Reporter ID: {report.userId}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className='p-4 text-right align-top space-x-2'>
                          <button type='button' onClick={() => dismissReports(job._id)}
                                  className='cursor-pointer rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 active:scale-95 transition-all'>Dismiss Flags</button>
                          <button type='button' onClick={() => handleDeleteJob(job._id)}
                                  className='cursor-pointer rounded-lg bg-rose-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-rose-700 active:scale-95 transition-all shadow-sm'>Delete Listing</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className='p-8 text-center text-slate-500 font-semibold'>
                        No reported job listings found in the queue.
                      </td>
                    </tr>
                  )}
                  {/* Pagination Controls */}
                  {reportedJobs.length > rowsPerPage && (
                    <tr>
                      <td colSpan={4} className='p-4 flex justify-center space-x-2'>
                        <button onClick={() => setPageReported(p => Math.max(p - 1, 1))} disabled={pageReported === 1}
                                className='px-3 py-1 border rounded disabled:opacity-50 text-slate-500'>Prev</button>
                        <span className='px-2 text-slate-500 flex items-center'>Page {pageReported} of {Math.ceil(reportedJobs.length / rowsPerPage)}</span>
                        <button onClick={() => setPageReported(p => Math.min(p + 1, Math.ceil(reportedJobs.length / rowsPerPage)))}
                                disabled={pageReported >= Math.ceil(reportedJobs.length / rowsPerPage)}
                                className='px-3 py-1 border rounded disabled:opacity-50 text-slate-500'>Next</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

const MetricCard = ({ icon, title, count, color, highlight = false }) => (
  <div className={`rounded-3xl border p-5 flex items-center justify-between transition-all hover:scale-[1.01] ${highlight ? 'bg-amber-50 border-amber-100' : 'bg-white/88 border-slate-200 shadow-[0_14px_40px_rgba(15,23,42,0.06)]'}`}>
    <div>
      <p className='text-[10px] font-bold uppercase tracking-wider text-slate-500'>{title}</p>
      <h3 className='text-2xl font-black mt-1 text-slate-950'>{count}</h3>
    </div>
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
      {React.cloneElement(icon, { size: 18 })}
    </div>
  </div>
)

export default App
