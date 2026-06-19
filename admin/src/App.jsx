import React, { useEffect, useState } from 'react'
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
  LogOut
} from 'lucide-react'
import logo from './assets/logo.svg'

const App = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null)
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
  const [searchQuery, setSearchQuery] = useState('')

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

  useEffect(() => {
    if (adminToken) {
      fetchStats()
      fetchCompanies()
    }
  }, [adminToken])

  // Filtered companies based on search
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Login view if unauthenticated
  if (!adminToken) {
    return (
      <div className='relative flex min-h-screen items-center justify-center bg-gray-950 p-4 font-sans text-white overflow-hidden w-full'>
        <ToastContainer theme="dark" />
        <div className='absolute left-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-blue-600/10 blur-3xl' />
        <div className='absolute right-1/4 bottom-1/4 h-[350px] w-[350px] rounded-full bg-purple-600/10 blur-3xl' />

        <div className='relative w-full max-w-md rounded-3xl border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-xl'>
          <div className='mb-8 text-center'>
            <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]'>
              <ShieldAlert size={28} />
            </div>
            <h1 className='text-2xl font-extrabold tracking-tight'>Control Console</h1>
            <p className='text-xs text-gray-400 mt-2'>Sign in with administrator credentials.</p>
          </div>

          <form onSubmit={handleLogin} className='space-y-4'>
            <div className='flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3.5 focus-within:border-blue-500/50 transition-all'>
              <Mail size={18} className='text-gray-400' />
              <input
                type='email'
                placeholder='Admin Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full bg-transparent text-sm font-semibold outline-none placeholder:text-gray-500 text-white'
              />
            </div>

            <div className='flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3.5 focus-within:border-blue-500/50 transition-all'>
              <Lock size={18} className='text-gray-400' />
              <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full bg-transparent text-sm font-semibold outline-none placeholder:text-gray-500 text-white'
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

  // Dashboard view if authenticated
  return (
    <div className='min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-600 selection:text-white w-full'>
      <ToastContainer theme="dark" />
      
      {/* Upper Navigation Bar */}
      <header className='sticky top-0 z-40 border-b border-white/5 bg-gray-950/80 backdrop-blur-xl'>
        <div className='flex items-center justify-between px-6 py-4 max-w-7xl mx-auto'>
          <div className='flex items-center gap-4'>
            <img className='w-32 opacity-95' src={logo} alt='InsiderJobs' />
            <span className='rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-red-400'>
              HQ Admin Console
            </span>
          </div>

          <button
            onClick={handleLogout}
            className='flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold hover:bg-white/10 transition-colors'
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-6 py-8'>
        
        {/* Metric Cards Row */}
        <section className='grid grid-cols-2 gap-4 md:grid-cols-4 mb-8'>
          <MetricCard icon={<Building />} title='Total Companies' count={stats.totalCompanies} color='text-blue-400 bg-blue-500/10 border-blue-500/10' />
          <MetricCard icon={<ShieldAlert />} title='Pending Approval' count={stats.pendingVerifications} color='text-amber-400 bg-amber-500/10 border-amber-500/10' highlight />
          <MetricCard icon={<Briefcase />} title='Active Postings' count={stats.totalJobs} color='text-emerald-400 bg-emerald-500/10 border-emerald-500/10' />
          <MetricCard icon={<FileText />} title='Applications Submitted' count={stats.totalApplications} color='text-purple-400 bg-purple-500/10 border-purple-500/10' />
        </section>

        {/* Company Moderation Table Area */}
        <section className='rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6'>
            <div>
              <h2 className='text-xl font-extrabold tracking-tight'>Workspaces Moderation</h2>
              <p className='text-xs text-gray-400 mt-1'>Review recruiter profiles and toggle domain verification state.</p>
            </div>
            
            {/* Search Box */}
            <div className='flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/5 px-3 py-2 w-full sm:max-w-xs focus-within:border-blue-500/30 transition-all'>
              <Search size={16} className='text-gray-400' />
              <input
                type='text'
                placeholder='Search by workspace...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='bg-transparent text-xs font-semibold outline-none text-white w-full placeholder:text-gray-500'
              />
            </div>
          </div>

          <div className='overflow-x-auto rounded-2xl border border-white/5 bg-white/5'>
            <table className='w-full text-left border-collapse text-xs'>
              <thead>
                <tr className='border-b border-white/5 bg-white/[0.02] font-extrabold text-gray-400'>
                  <th className='p-4'>Company</th>
                  <th className='p-4'>Email Domain</th>
                  <th className='p-4'>Verification Status</th>
                  <th className='p-4 text-right'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/5'>
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <tr key={company._id} className='hover:bg-white/[0.01] transition-colors'>
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <img src={company.image} alt={company.name} className='h-8 w-8 rounded-lg object-contain bg-white p-1' />
                          <span className='font-bold text-gray-200'>{company.name}</span>
                        </div>
                      </td>
                      <td className='p-4 font-semibold text-gray-400'>
                        {company.email}
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
                        <button
                          onClick={() => toggleVerification(company._id, company.isVerified)}
                          className={`cursor-pointer rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all active:scale-95 ${
                            company.isVerified
                              ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/10'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/10'
                          }`}
                        >
                          {company.isVerified ? 'Revoke Approval' : 'Approve Domain'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className='p-8 text-center text-gray-500 font-semibold'>
                      No workspace profiles match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

const MetricCard = ({ icon, title, count, color, highlight = false }) => (
  <div className={`rounded-3xl border p-5 flex items-center justify-between transition-all hover:scale-[1.01] ${highlight ? 'bg-amber-500/[0.03] border-amber-500/10' : 'bg-white/5 border-white/5'}`}>
    <div>
      <p className='text-[10px] font-bold uppercase tracking-wider text-gray-400'>{title}</p>
      <h3 className='text-2xl font-black mt-1 text-white'>{count}</h3>
    </div>
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
      {React.cloneElement(icon, { size: 18 })}
    </div>
  </div>
)

export default App
