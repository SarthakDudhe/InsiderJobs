import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useClerk, useUser, UserButton } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const Navbar = () => {
  const { openSignIn } = useClerk()
  const { user } = useUser();
  const navigate = useNavigate()

  const { setShowRecruiterLogin } = useContext(AppContext)

  return (
    <div className='shadow py-4'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
        <img onClick={() => navigate("/")} className='cursor-pointer w-32 sm:w-auto' src={assets.logo} alt="" />
        {
          user ? <div className='flex items-center gap-3 sm:gap-5 text-gray-800 text-xs sm:text-base'>
            <Link className='hover:text-blue-600 transition-colors' to={'/ai-recommender'}>✨ <span className='max-sm:hidden'>AI Recommender</span><span className='sm:hidden'>AI</span></Link>
            <p className='text-gray-400'>|</p>
            <Link className='hover:text-blue-600 transition-colors text-nowrap' to={'/opportunities'}>Opportunities</Link>
            <p className='text-gray-400'>|</p>
            <Link className='hover:text-blue-600 transition-colors text-nowrap' to={'/applications'}>Applied <span className='max-sm:hidden'>Jobs</span></Link>
            <p className='text-gray-400'>|</p>
            <p className='max-sm:hidden'>Hi, {user.firstName}</p>
            <div className='flex items-center'>
              <UserButton />
            </div>
          </div> : <div className='flex gap-3 sm:gap-4 items-center'>
            <button onClick={(e) => setShowRecruiterLogin(true)} className='text-gray-600 text-xs sm:text-base cursor-pointer'>Recruiter Login</button>
            <button onClick={e => openSignIn()} className='bg-blue-600 text-white px-5 sm:px-9 py-1.5 sm:py-2 rounded-full text-xs sm:text-base cursor-pointer font-medium transition-all hover:bg-blue-700'>Login</button>
          </div>
        }

      </div>

    </div>
  )
}

export default Navbar;