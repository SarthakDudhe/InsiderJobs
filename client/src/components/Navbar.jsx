import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { BrainCircuit, BriefcaseBusiness, User, LogOut, ChevronDown } from 'lucide-react'
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

  return (
    <div className='sticky top-0 z-40 border-b border-slate-200/80 bg-white/82 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl'>
      <div className='ij-container flex items-center justify-between'>
        <img
          onClick={() => navigate('/')}
          className='w-32 cursor-pointer transition-transform hover:scale-[1.02] sm:w-40'
          src={assets.logo}
          alt='InsiderJobs'
        />

        {userData ? (
          <div className='flex items-center gap-2 text-xs font-semibold text-slate-600 sm:gap-3 sm:text-sm'>
            <Link className='inline-flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-700' to='/ai-recommender'>
              <BrainCircuit size={16} />
              <span className='max-sm:hidden'>AI Recommender</span>
              <span className='sm:hidden'>AI</span>
            </Link>
            <Link className='text-nowrap rounded-full px-3 py-2 transition-colors hover:bg-slate-100 hover:text-slate-950' to='/opportunities'>
              Opportunities
            </Link>
            <Link className='text-nowrap rounded-full px-3 py-2 transition-colors hover:bg-slate-100 hover:text-slate-950' to='/applications'>
              Applied <span className='max-sm:hidden'>Jobs</span>
            </Link>
            <p className='pl-2 text-slate-500 max-md:hidden font-bold'>Hi, {userData.name.split(' ')[0]}</p>
            
            <div className='relative'>
              <button 
                onClick={() => setShowDropdown(!showDropdown)} 
                className='flex items-center gap-1 cursor-pointer focus:outline-none'
              >
                <img 
                  className='h-8 w-8 rounded-full border border-slate-200 object-cover' 
                  src={userData.image} 
                  alt={userData.name} 
                />
                <ChevronDown size={14} className='text-slate-500' />
              </button>
              
              {showDropdown && (
                <div className='absolute right-0 mt-2.5 w-44 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-[0_12px_30px_rgba(15,23,42,0.1)] z-50'>
                  <div className='border-b border-slate-100 pb-2 mb-2 px-1'>
                    <p className='text-xs font-bold text-slate-900 truncate'>{userData.name}</p>
                    <p className='text-[10px] text-slate-500 truncate'>{userData.email}</p>
                  </div>
                  <Link 
                    onClick={() => setShowDropdown(false)}
                    className='flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors' 
                    to='/applications'
                  >
                    <User size={14} /> My Profile
                  </Link>
                  <button 
                    onClick={() => {
                      setShowDropdown(false)
                      logout()
                    }}
                    className='flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer text-left'
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='flex items-center gap-3 sm:gap-4'>
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className='inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 sm:text-sm'
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
    </div>
  )
}

export default Navbar
