import React, { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { Bell, Bookmark, BrainCircuit, BriefcaseBusiness, ChartNoAxesColumnIncreasing, ChevronDown, Compass, LogOut, Search, User } from 'lucide-react'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const { setShowRecruiterLogin, setShowUserLogin, userData, setUserData, setUserToken } = useContext(AppContext)
  const [showDropdown, setShowDropdown] = useState(false)

  const logout = () => {
    setUserData(null)
    setUserToken(null)
    localStorage.removeItem('userToken')
    navigate('/')
    toast.success('Logged out successfully')
  }

  const navItems = [
    { label: 'Discover', path: '/', icon: Compass },
    { label: 'Jobs', path: '/opportunities', icon: BriefcaseBusiness },
    { label: 'Applications', path: '/applications', icon: ChartNoAxesColumnIncreasing },
    { label: 'AI Assistant', path: '/ai-recommender', icon: BrainCircuit }
  ]

  return (
    <>
      <header className='sticky top-0 z-40 border-b border-slate-200/70 bg-white/86 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.055)] backdrop-blur-xl'>
        <div className='ij-container flex items-center justify-between gap-4'>
          <button
            onClick={() => navigate('/')}
            className='ij-focus-ring flex items-center gap-3 rounded-xl text-left transition-transform hover:scale-[1.01]'
            aria-label='Go to InsiderJobs home'
          >
            <span className='ij-brand-mark'>IJ</span>
            <span className='leading-none'>
              <span className='block text-[15px] font-bold tracking-[-0.03em] text-slate-950 sm:text-base'>InsiderJobs</span>
              <span className='hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:block'>Career OS</span>
            </span>
          </button>

          <nav className='hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/70 p-1 lg:flex' aria-label='Primary navigation'>
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={label}
                to={path}
                end={path === '/'}
                className={({ isActive }) => `ij-nav-link ij-focus-ring ${isActive ? 'ij-nav-link-active' : ''}`}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          {userData ? (
            <div className='flex items-center gap-2 text-xs font-semibold text-slate-600 sm:gap-3 sm:text-sm'>
              <button className='ij-focus-ring hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-950 md:inline-flex' aria-label='Search'>
                <Search size={17} />
              </button>
              <button className='ij-focus-ring hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-950 md:inline-flex' aria-label='Saved jobs'>
                <Bookmark size={17} />
              </button>
              <button className='ij-focus-ring hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-950 md:inline-flex' aria-label='Notifications'>
                <Bell size={17} />
              </button>
              <p className='pl-1 text-slate-500 max-md:hidden font-semibold'>Hi, {userData.name.split(' ')[0]}</p>

              <div className='relative'>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className='ij-focus-ring flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-2 shadow-sm'
                  aria-expanded={showDropdown}
                  aria-label='Open user menu'
                >
                  <img
                    className='h-8 w-8 rounded-full object-cover'
                    src={userData.image}
                    alt={userData.name}
                  />
                  <ChevronDown size={14} className='text-slate-500' />
                </button>

                {showDropdown && (
                  <div className='absolute right-0 z-50 mt-2.5 w-56 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_18px_45px_rgba(15,23,42,0.14)]'>
                    <div className='mb-2 border-b border-slate-100 px-2 pb-3 pt-1'>
                      <p className='truncate text-sm font-bold text-slate-900'>{userData.name}</p>
                      <p className='truncate text-xs text-slate-500'>{userData.email}</p>
                    </div>
                    <Link
                      onClick={() => setShowDropdown(false)}
                      className='flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900'
                      to='/applications'
                    >
                      <User size={14} /> Career profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowDropdown(false)
                        logout()
                      }}
                      className='flex w-full cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700'
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-2 sm:gap-3'>
              <button
                onClick={() => setShowRecruiterLogin(true)}
                className='ij-focus-ring inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 sm:text-sm'
              >
                <BriefcaseBusiness size={16} />
                <span className='max-sm:hidden'>Recruiter</span>
              </button>
              <button onClick={() => setShowUserLogin(true)} className='magic-button cursor-pointer px-5 py-2.5 text-xs sm:px-7 sm:text-sm'>
                <span className='button-inner'>Login</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {userData && (
        <nav className='fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-slate-200 bg-white/92 p-1.5 shadow-[0_18px_55px_rgba(15,23,42,0.16)] backdrop-blur-xl lg:hidden' aria-label='Mobile navigation'>
          <div className='grid grid-cols-4 gap-1'>
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={label}
                to={path}
                end={path === '/'}
                className={({ isActive }) => `ij-mobile-tab ij-focus-ring ${isActive ? 'ij-mobile-tab-active' : ''}`}
              >
                <Icon size={18} />
                <span>{label === 'AI Assistant' ? 'AI' : label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </>
  )
}

export default Navbar
