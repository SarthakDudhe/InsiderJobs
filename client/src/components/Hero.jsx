import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { ArrowRight, BriefcaseBusiness, MapPin, Search, ShieldCheck, Sparkles } from 'lucide-react'

const MotionDiv = motion.div

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
    <div className='relative overflow-hidden'>
      <div className='ij-container relative z-10 pt-16 pb-12 md:pt-24 md:pb-16'>
        <div className='grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]'>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center lg:text-left'
          >
            <h1 className='mb-6 text-4xl font-extrabold leading-[1.02] text-gray-950 md:text-6xl lg:text-7xl'>
              Find sharper work with a platform built for serious careers.
            </h1>
            <p className='mx-auto mb-9 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl lg:mx-0'>
              InsiderJobs connects ambitious candidates with verified roles, AI-guided recommendations, and recruiter workflows that feel polished from first search to final shortlist.
            </p>

            <MotionDiv
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='premium-card w-full rounded-[1.75rem] p-2.5'
            >
              <div className='grid gap-2 md:grid-cols-[1fr_1fr_auto]'>
                <div className='premium-input flex items-center rounded-2xl px-4 py-4'>
                  <Search className='mr-3 h-5 w-5 shrink-0 text-blue-600' />
                  <input
                    ref={titleRef}
                    type='text'
                    placeholder='Job title, skills, or company'
                    className='w-full border-none bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400 md:text-base'
                  />
                </div>
                <div className='premium-input flex items-center rounded-2xl px-4 py-4'>
                  <MapPin className='mr-3 h-5 w-5 shrink-0 text-blue-600' />
                  <input
                    ref={locationRef}
                    type='text'
                    placeholder='City, state, or remote'
                    className='w-full border-none bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400 md:text-base'
                  />
                </div>
                <button onClick={onSearch} className='premium-button w-full px-7 py-4 text-sm md:w-auto md:text-base'>
                  Find Jobs <ArrowRight size={18} />
                </button>
              </div>
            </MotionDiv>

            <div className='mx-auto mt-10 grid max-w-xl grid-cols-3 gap-3 text-left lg:mx-0'>
              <MiniProof icon={<ShieldCheck />} value='Verified' label='company listings' />
              <MiniProof icon={<Sparkles />} value='AI-led' label='career matching' />
              <MiniProof icon={<BriefcaseBusiness />} value='Recruiter' label='grade workflow' />
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className='relative'
          >
            <div className='premium-card float-slow rounded-[2rem] p-5 md:p-7'>
              <div className='mb-5 flex items-center justify-between border-b border-gray-100 pb-4'>
                <div>
                  <p className='text-xs font-bold uppercase tracking-[0.18em] text-blue-600'>Live talent market</p>
                  <h3 className='mt-1 text-xl font-extrabold text-gray-950'>Senior Product Designer</h3>
                </div>
                <span className='status-chip border border-green-100 bg-green-50 text-green-700'>92% Match</span>
              </div>
              <div className='space-y-3'>
                {[
                  ['Product Lead', 'Remote', 'Shortlisted'],
                  ['React Engineer', 'Bengaluru', 'Interview'],
                  ['Data Analyst', 'Mumbai', 'New lead']
                ].map((item, index) => (
                  <div key={item[0]} className='flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition-all hover:bg-white hover:shadow-sm'>
                    <div>
                      <p className='font-bold text-gray-950'>{item[0]}</p>
                      <p className='text-sm text-gray-500'>{item[1]}</p>
                    </div>
                    <span className={`status-chip ${index === 1 ? 'border border-blue-100 bg-blue-50 text-blue-700' : index === 0 ? 'border border-amber-100 bg-amber-50 text-amber-700' : 'border border-gray-200 bg-gray-100 text-gray-600'}`}>
                      {item[2]}
                    </span>
                  </div>
                ))}
              </div>
              <div className='mt-5 grid grid-cols-3 gap-3'>
                <Metric value='10k+' label='Listings' />
                <Metric value='500+' label='Companies' />
                <Metric value='8k+' label='Placements' />
              </div>
            </div>
          </MotionDiv>
        </div>

        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.45 }}
          className='mt-16 w-full'
        >
          <div className='flex flex-wrap items-center justify-center gap-6 opacity-70 grayscale transition-all duration-500 hover:grayscale-0 md:gap-14'>
            <p className='mb-1 w-full text-center text-xs font-bold uppercase tracking-[0.18em] text-gray-400 md:text-sm'>Trusted by hiring teams at</p>
            <img className='h-5 transition-transform hover:scale-110 md:h-8' src={assets.microsoft_logo} alt='Microsoft' />
            <img className='h-5 transition-transform hover:scale-110 md:h-8' src={assets.walmart_logo} alt='Walmart' />
            <img className='h-5 transition-transform hover:scale-110 md:h-8' src={assets.accenture_logo} alt='Accenture' />
            <img className='h-5 transition-transform hover:scale-110 md:h-8' src={assets.samsung_logo} alt='Samsung' />
            <img className='h-5 transition-transform hover:scale-110 md:h-8' src={assets.amazon_logo} alt='Amazon' />
            <img className='h-5 transition-transform hover:scale-110 md:h-8' src={assets.adobe_logo} alt='Adobe' />
          </div>
        </MotionDiv>
      </div>
    </div>
  )
}

const MiniProof = ({ icon, value, label }) => (
  <div className='rounded-2xl border border-gray-200 bg-white/70 p-3 shadow-sm'>
    {React.cloneElement(icon, { size: 18, className: 'mb-2 text-blue-600' })}
    <p className='text-sm font-extrabold text-gray-950'>{value}</p>
    <p className='text-xs text-gray-500'>{label}</p>
  </div>
)

const Metric = ({ value, label }) => (
  <div className='rounded-2xl bg-gray-950 p-4 text-center text-white'>
    <p className='text-xl font-extrabold'>{value}</p>
    <p className='text-xs text-gray-400'>{label}</p>
  </div>
)

export default Hero
