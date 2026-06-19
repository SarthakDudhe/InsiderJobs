import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  Layers3,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound
} from 'lucide-react'

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
    <section className='relative isolate overflow-hidden bg-[#f5f7fb] text-slate-950'>
      <div className='hero-grid-bg absolute inset-0 opacity-70' />
      <div className='hero-aurora absolute inset-x-0 top-0 h-[520px]' />

      <div className='ij-container relative z-10 pt-10 pb-10 md:pt-16 md:pb-14'>
        <div className='mx-auto max-w-4xl text-center'>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='mx-auto'
          >
            <p className='mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur'>
              <Sparkles className='h-4 w-4 text-blue-600' />
              AI-matched roles, verified recruiters, zero job-board noise
            </p>
            <h1 className='mx-auto max-w-5xl text-4xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-5xl md:text-7xl'>
              Find work with insider-grade clarity.
            </h1>
            <p className='mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg'>
              InsiderJobs turns career search into a focused command center: verified openings, intelligent recommendations, application tracking, and recruiter tools in one polished workspace.
            </p>

            <MotionDiv
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='mx-auto mt-8 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white/90 p-2.5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl'
            >
              <div className='grid gap-2 md:grid-cols-[1fr_1fr_auto]'>
                <div className='hero-search-field flex items-center rounded-xl px-4 py-4'>
                  <Search className='mr-3 h-5 w-5 shrink-0 text-blue-600' />
                  <input
                    ref={titleRef}
                    type='text'
                    placeholder='Job title, skills, or company'
                    className='w-full border-none bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 md:text-base'
                  />
                </div>
                <div className='hero-search-field flex items-center rounded-xl px-4 py-4'>
                  <MapPin className='mr-3 h-5 w-5 shrink-0 text-blue-600' />
                  <input
                    ref={locationRef}
                    type='text'
                    placeholder='City, state, or remote'
                    className='w-full border-none bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 md:text-base'
                  />
                </div>
                <button onClick={onSearch} className='magic-button w-full px-7 py-4 text-sm md:w-auto md:text-base'>
                  <span className='points-wrapper'>
                    {[...Array(10)].map((_, index) => <i key={index} className='point' />)}
                  </span>
                  <span className='button-inner'>Find Jobs <ArrowRight size={18} /></span>
                </button>
              </div>
            </MotionDiv>

            <div className='mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-3 text-left'>
              <MiniProof icon={<ShieldCheck />} value='Verified' label='company listings' />
              <MiniProof icon={<UsersRound />} value='10k+' label='active candidates' />
              <MiniProof icon={<BriefcaseBusiness />} value='500+' label='hiring teams' />
            </div>
          </MotionDiv>
        </div>

        <div className='relative mx-auto mt-12 max-w-7xl'>
          <MotionDiv
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className='relative overflow-hidden rounded-2xl border border-slate-200 bg-white/88 shadow-[0_35px_110px_rgba(15,23,42,0.16)] backdrop-blur-xl'
          >
            <div className='flex items-center justify-between border-b border-slate-200 px-3 py-2.5'>
              <div className='flex items-center gap-2'>
                <span className='h-3 w-3 rounded-full bg-red-400/80' />
                <span className='h-3 w-3 rounded-full bg-amber-300/80' />
                <span className='h-3 w-3 rounded-full bg-emerald-400/80' />
                <div className='ml-3 hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600 sm:flex'>
                  <Layers3 className='h-3.5 w-3.5 text-blue-600' />
                  InsiderJobs Console - Live market
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <button className='hidden rounded-md border border-slate-200 bg-slate-50 p-1.5 text-slate-600 transition hover:bg-white sm:inline-flex' aria-label='Notifications'>
                  <Bell className='h-4 w-4' />
                </button>
                <button className='rounded-md bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-500'>Publish role</button>
              </div>
            </div>

            <div className='grid min-h-[520px] grid-cols-1 md:grid-cols-12'>
              <aside className='hidden border-r border-slate-200 bg-slate-50/80 p-4 md:col-span-3 md:block'>
                <div className='mb-4 flex items-center justify-between'>
                  <span className='rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600'>Talent radar</span>
                  <Search className='h-4 w-4 text-slate-500' />
                </div>
                <div className='space-y-2'>
                  {['AI matched', 'Recently funded', 'Remote friendly', 'Fast response'].map((item, index) => (
                    <div key={item} className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${index === 0 ? 'bg-blue-50 text-blue-700' : 'bg-white text-slate-600'}`}>
                      <span>{item}</span>
                      <span className='text-slate-400'>{index === 0 ? '128' : 42 - index * 6}</span>
                    </div>
                  ))}
                </div>
                <div className='mt-5 rounded-xl border border-slate-200 bg-white p-3'>
                  <p className='text-xs font-semibold text-slate-700'>Pipeline health</p>
                  <div className='mt-3 space-y-3'>
                    <Progress label='Shortlist' value='78%' />
                    <Progress label='Interview' value='54%' />
                    <Progress label='Offer' value='31%' />
                  </div>
                </div>
              </aside>

              <main className='relative bg-white p-4 md:col-span-6 sm:p-6'>
                <div className='mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-600'>
                  <Building2 className='h-4 w-4 text-blue-600' />
                  <span>Senior Product Designer</span>
                  <span className='rounded-md bg-slate-100 px-2 py-1'>Remote</span>
                  <span className='rounded-md bg-emerald-50 px-2 py-1 text-emerald-700'>92% match</span>
                </div>
                <div className='overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70'>
                  <div className='border-b border-slate-200 bg-white p-4'>
                    <div className='flex items-start justify-between gap-4'>
                      <div>
                        <h3 className='text-2xl font-semibold tracking-tight text-slate-950'>Executive shortlist</h3>
                        <p className='mt-1 text-sm leading-6 text-slate-500'>Ranked by role fit, verified experience, and recruiter response velocity.</p>
                      </div>
                      <span className='rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700'>Live</span>
                    </div>
                  </div>
                  <div className='divide-y divide-slate-200'>
                    {[
                      ['Aarav Mehta', 'Product Design Lead', 'Bengaluru', 'Top 3% fit', '98'],
                      ['Mira Kapoor', 'Senior UX Strategist', 'Remote', 'Interview ready', '94'],
                      ['Dev Shah', 'Design Systems Manager', 'Mumbai', 'Fast response', '91']
                    ].map((item, index) => (
                      <div key={item[0]} className='grid gap-3 p-4 transition hover:bg-white sm:grid-cols-[1fr_auto] sm:items-center'>
                        <div className='flex items-center gap-3'>
                          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white'>{item[0].split(' ').map(part => part[0]).join('')}</div>
                          <div>
                            <p className='font-semibold text-slate-950'>{item[0]}</p>
                            <p className='text-sm text-slate-500'>{item[1]} - {item[2]}</p>
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${index === 0 ? 'bg-emerald-50 text-emerald-700' : index === 1 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{item[3]}</span>
                          <span className='text-sm font-bold text-slate-950'>{item[4]}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='mt-4 grid gap-3 sm:grid-cols-3'>
                  <Metric value='10k+' label='Listings' />
                  <Metric value='8k+' label='Placements' />
                  <Metric value='24h' label='Avg. reply' />
                </div>
              </main>

              <aside className='hidden border-l border-slate-200 bg-slate-50/80 p-4 md:col-span-3 md:block'>
                <div className='mb-4 rounded-xl border border-slate-200 bg-white p-4'>
                  <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-400'>Role score</p>
                  <div className='mt-3 flex items-end gap-2'>
                    <span className='text-5xl font-semibold text-slate-950'>92</span>
                    <span className='mb-2 text-sm font-bold text-emerald-700'>Excellent</span>
                  </div>
                  <p className='mt-2 text-xs leading-5 text-slate-500'>Strong match for leadership, portfolio depth, and design systems ownership.</p>
                </div>
                <div className='space-y-2'>
                  {[
                    ['Resume parsed', CheckCircle2, 'text-emerald-600'],
                    ['Recruiter verified', ShieldCheck, 'text-blue-600'],
                    ['Interview window', Clock3, 'text-amber-600']
                  ].map(([label, Icon, color]) => (
                    <div key={label} className='flex items-center gap-3 rounded-lg bg-white p-3 text-sm text-slate-600'>
                      {React.createElement(Icon, { className: `h-4 w-4 ${color}` })}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </MotionDiv>
        </div>

        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.45 }}
          className='mt-10 w-full'
        >
          <div className='flex flex-wrap items-center justify-center gap-6 opacity-70 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 md:gap-14'>
            <p className='mb-1 w-full text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-500 md:text-sm'>Trusted by hiring teams at</p>
            <img className='h-5 transition-transform hover:scale-110 md:h-7' src={assets.microsoft_logo} alt='Microsoft' />
            <img className='h-5 transition-transform hover:scale-110 md:h-7' src={assets.walmart_logo} alt='Walmart' />
            <img className='h-5 transition-transform hover:scale-110 md:h-7' src={assets.accenture_logo} alt='Accenture' />
            <img className='h-5 transition-transform hover:scale-110 md:h-7' src={assets.samsung_logo} alt='Samsung' />
            <img className='h-5 transition-transform hover:scale-110 md:h-7' src={assets.amazon_logo} alt='Amazon' />
            <img className='h-5 transition-transform hover:scale-110 md:h-7' src={assets.adobe_logo} alt='Adobe' />
          </div>
        </MotionDiv>
      </div>
    </section>
  )
}

const MiniProof = ({ icon, value, label }) => (
  <div className='rounded-xl border border-slate-200 bg-white/82 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]'>
    {React.cloneElement(icon, { size: 18, className: 'mb-2 text-blue-600' })}
    <p className='text-sm font-bold text-slate-950'>{value}</p>
    <p className='text-xs text-slate-500'>{label}</p>
  </div>
)

const Metric = ({ value, label }) => (
  <div className='rounded-xl border border-slate-200 bg-white p-4 text-center text-slate-950'>
    <p className='text-xl font-semibold'>{value}</p>
    <p className='text-xs text-slate-500'>{label}</p>
  </div>
)

const Progress = ({ label, value }) => (
  <div>
    <div className='mb-1 flex items-center justify-between text-[11px] text-slate-500'>
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className='h-1.5 overflow-hidden rounded-full bg-slate-200'>
      <div className='h-full rounded-full bg-blue-600' style={{ width: value }} />
    </div>
  </div>
)

export default Hero
