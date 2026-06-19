import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useClerk, useUser, UserButton } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { BrainCircuit, BriefcaseBusiness } from 'lucide-react'

const Navbar = () => {
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const navigate = useNavigate()
  const { setShowRecruiterLogin } = useContext(AppContext)

  return (
    <div className='sticky top-0 z-40 border-b border-slate-200/80 bg-white/82 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl'>
      <div className='ij-container flex items-center justify-between'>
        <img
          onClick={() => navigate('/')}
          className='w-32 cursor-pointer transition-transform hover:scale-[1.02] sm:w-40'
          src={assets.logo}
          alt='InsiderJobs'
        />

        {user ? (
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
            <p className='pl-2 text-slate-500 max-md:hidden'>Hi, {user.firstName}</p>
            <UserButton />
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
            <button onClick={() => openSignIn()} className='magic-button cursor-pointer px-5 py-2.5 text-xs sm:px-7 sm:text-sm'>
              <span className='button-inner'>Login</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
