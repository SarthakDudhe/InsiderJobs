import React, { useContext, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { BriefcaseBusiness, ClipboardList, FilePlus2, LogOut, UsersRound } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const navigate = useNavigate()
  const { companyData, setcompanyData, setCompanyToken, companyToken, backendUrl } = useContext(AppContext)

  const handleVerifyDemo = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/company/verify-demo',
        {},
        { headers: { token: companyToken } }
      )
      if (data.success) {
        toast.success(data.message)
        setcompanyData(prev => ({ ...prev, isVerified: true }))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = () => {
    setCompanyToken(null)
    localStorage.removeItem('companyToken')
    setcompanyData(null)
    navigate('/')
  }

  useEffect(() => {
    if (companyData) {
      navigate('/dashboard/manage-jobs')
    }
  }, [companyData])

  return (
    <div className='min-h-screen ij-shell'>
      <header className='sticky top-0 z-30 border-b border-slate-200/80 bg-white/88 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl'>
        <div className='flex items-center justify-between px-5 py-4'>
          <div className='flex items-center gap-4'>
            <img onClick={() => navigate('/')} className='w-32 cursor-pointer sm:w-40' src={assets.logo} alt='InsiderJobs' />
            <span className='hidden rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-500 md:inline-flex'>
              Recruiter Console
            </span>
          </div>
          {companyData && (
            <div className='flex items-center gap-3'>
              <div className='text-right max-sm:hidden'>
                <p className='text-sm font-extrabold text-gray-950'>{companyData.name}</p>
                <p className='text-xs text-gray-500'>Hiring workspace</p>
              </div>
              <div className='relative group'>
                <img className='h-10 w-10 rounded-full border border-gray-200 object-cover p-0.5' src={companyData.image} alt={companyData.name} />
                <div className='absolute right-0 top-0 z-10 hidden pt-12 text-black group-hover:block'>
                  <button onClick={logout} className='flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold shadow-xl transition-colors hover:bg-gray-50'>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className='flex items-start'>
        <aside className='sticky top-[73px] hidden min-h-[calc(100vh-73px)] w-72 border-r border-slate-200 bg-white/78 p-4 text-slate-950 shadow-[12px_0_40px_rgba(15,23,42,0.04)] backdrop-blur-xl md:block'>
          <div className='mb-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4'>
            <BriefcaseBusiness className='mb-3 text-blue-600' size={22} />
            <p className='text-sm font-extrabold'>Executive hiring tools</p>
            <p className='mt-1 text-xs leading-relaxed text-slate-600'>Post roles, review applicants, and keep pipeline decisions clean.</p>
          </div>
          <DashboardNav />
        </aside>

        <aside className='sticky top-[73px] min-h-[calc(100vh-73px)] border-r border-slate-200 bg-white/82 p-2 text-slate-950 md:hidden'>
          <DashboardNav compact />
        </aside>

        <main className='min-w-0 flex-1 p-3 sm:p-6'>
          {companyData && !companyData.isVerified && (
            <div className='mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm transition-all duration-300'>
              <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
                <div className='flex items-start gap-3'>
                  <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 font-bold'>⚠️</span>
                  <div>
                    <h4 className='text-sm font-extrabold text-amber-900'>Workspace Pending Verification</h4>
                    <p className='text-xs text-amber-700 mt-1 leading-relaxed max-w-2xl'>
                      Your company profile is currently under review. Any jobs you post will remain as drafts and hidden from candidates until the workspace domain is verified.
                    </p>
                  </div>
                </div>
                <button
                  type='button'
                  onClick={handleVerifyDemo}
                  className='cursor-pointer text-nowrap rounded-xl bg-amber-600 px-4 py-2 text-xs font-extrabold text-white transition-all hover:bg-amber-700 active:scale-95 shadow-sm'
                >
                  Verify Workspace (Demo Mode)
                </button>
              </div>
            </div>
          )}
          <div className='rounded-[1.75rem] border border-slate-200 bg-white/60 p-3 shadow-[0_18px_55px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-5'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

const DashboardNav = ({ compact = false }) => {
  const links = [
    { to: '/dashboard/add-job', label: 'Add Job', icon: <FilePlus2 /> },
    { to: '/dashboard/manage-jobs', label: 'Manage Jobs', icon: <ClipboardList /> },
    { to: '/dashboard/view-applications', label: 'View Applications', icon: <UsersRound /> }
  ]

  return (
    <nav className='space-y-2'>
      {links.map(link => (
        <NavLink
          key={link.to}
          className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'} ${compact ? 'justify-center' : ''}`}
          to={link.to}
        >
          {React.cloneElement(link.icon, { size: 19 })}
          {!compact && <span>{link.label}</span>}
        </NavLink>
      ))}
    </nav>
  )
}

export default Dashboard
