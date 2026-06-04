import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { Search, MapPin, TrendingUp, Users, Building2 } from 'lucide-react'

const Hero = () => {

  const { setIsSearched, setSearchFilter } = useContext(AppContext)
  const titleRef = useRef(null)
  const locationRef = useRef(null)

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value
    })
    setIsSearched(true)
  }

  return (
    <div className='relative overflow-hidden bg-white'>
      {/* Background Decorative Elements */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none'>
        <div className='absolute -top-24 -left-24 w-64 h-64 md:w-96 md:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob'></div>
        <div className='absolute top-0 -right-24 w-64 h-64 md:w-96 md:h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000'></div>
        <div className='absolute -bottom-24 left-1/2 w-64 h-64 md:w-96 md:h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000'></div>
      </div>

      <div className='container 2xl:px-20 mx-auto pt-16 pb-12 relative z-10'>
        <div className='flex flex-col items-center text-center px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className='inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase bg-blue-50 text-blue-600 mb-6 border border-blue-100 shadow-sm'>
              🚀 Join the Future of Work
            </span>
            <h1 className='text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6'>
              Find Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>Dream Job</span> <br />
              With InsiderJobs
            </h1>
            <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed'>
              Streamline your job search with our AI-powered platform. Connect with top companies and take the next leap in your career journey today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='w-full max-w-4xl'
          >
            <div className='bg-white p-2 md:p-3 rounded-2xl shadow-2xl border border-gray-100 backdrop-blur-xl bg-opacity-80 flex flex-col md:flex-row items-center gap-2 md:gap-4'>
              <div className='flex items-center flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-gray-100 py-3 md:py-1'>
                <Search className='text-blue-500 w-5 h-5 mr-3 shrink-0' />
                <input
                  ref={titleRef}
                  type="text"
                  placeholder='Job title, skills, or company'
                  className='w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 font-medium text-sm md:text-base'
                />
              </div>
              <div className='flex items-center flex-1 w-full px-4 py-3 md:py-1'>
                <MapPin className='text-purple-500 w-5 h-5 mr-3 shrink-0' />
                <input
                  ref={locationRef}
                  type="text"
                  placeholder='City, state, or remote'
                  className='w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 font-medium text-sm md:text-base'
                />
              </div>
              <button
                onClick={onSearch}
                className='w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3.5 md:py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 text-sm md:text-base'
              >
                Find Jobs
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className='mt-16 w-full'
          >
            <div className='flex flex-wrap justify-center items-center gap-6 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500'>
              <p className='w-full text-center text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 md:mb-4'>Trusted by Global Leaders</p>
              <img className='h-5 md:h-8 transition-transform hover:scale-110' src={assets.microsoft_logo} alt="Microsoft" />
              <img className='h-5 md:h-8 transition-transform hover:scale-110' src={assets.walmart_logo} alt="Walmart" />
              <img className='h-5 md:h-8 transition-transform hover:scale-110' src={assets.accenture_logo} alt="Accenture" />
              <img className='h-5 md:h-8 transition-transform hover:scale-110' src={assets.samsung_logo} alt="Samsung" />
              <img className='h-5 md:h-8 transition-transform hover:scale-110' src={assets.amazon_logo} alt="Amazon" />
              <img className='h-5 md:h-8 transition-transform hover:scale-110' src={assets.adobe_logo} alt="Adobe" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section Integrated into Hero Bottom */}
      <div className='bg-gray-50 border-y border-gray-100 py-12'>
        <div className='container mx-auto px-4 2xl:px-20'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            <StatItem icon={<TrendingUp className='text-blue-600' />} value="10k+" label="Active Listings" />
            <StatItem icon={<Building2 className='text-purple-600' />} value="500+" label="Top Companies" />
            <StatItem icon={<Users className='text-pink-600' />} value="8k+" label="Success Stories" />
            <StatItem icon={<TrendingUp className='text-indigo-600' />} value="₹12L+" label="Avg. Package" />
          </div>
        </div>
      </div>
    </div>
  )
}

const StatItem = ({ icon, value, label }) => (
  <div className='flex flex-col items-center text-center p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300 transform hover:-translate-y-1'>
    <div className='p-3 bg-white rounded-xl shadow-sm border border-gray-50 mb-3'>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h4 className='text-2xl font-bold text-gray-900'>{value}</h4>
    <p className='text-sm font-medium text-gray-500 uppercase tracking-tighter'>{label}</p>
  </div>
)

export default Hero
