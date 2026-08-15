import React from 'react'
import { motion } from 'framer-motion'
import { BrainCircuit, Gauge, LineChart, MessageSquare, Radar, ShieldCheck } from 'lucide-react'

const MotionH2 = motion.h2
const MotionP = motion.p
const MotionDiv = motion.div

const features = [
  {
    icon: <BrainCircuit />,
    title: 'Role intelligence',
    description: 'AI evaluates resume context, seniority, compensation signals, location, and company momentum before ranking a role.'
  },
  {
    icon: <Gauge />,
    title: 'Decision-first search',
    description: 'Filters, match scores, freshness, and recruiter response data are composed for fast comparison without portal clutter.'
  },
  {
    icon: <Radar />,
    title: 'Opportunity radar',
    description: 'Track fresh listings, remote flexibility, verified companies, saved roles, and strong-match searches from one command surface.'
  },
  {
    icon: <ShieldCheck />,
    title: 'Verified hiring teams',
    description: 'Company-led postings and recruiter controls make every interaction feel accountable and professional.'
  },
  {
    icon: <MessageSquare />,
    title: 'Career CRM',
    description: 'Applications, resumes, notes, and next actions stay organized in a pipeline built for repeated daily use.'
  },
  {
    icon: <LineChart />,
    title: 'Outcome tracking',
    description: 'Application history, interview readiness, and status semantics turn the search into a clear pipeline instead of a black box.'
  }
]

const Features = () => {
  return (
    <section className='bg-[var(--ij-canvas)] py-24 text-slate-950'>
      <div className='ij-container'>
        <div className='mb-14 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end'>
          <div>
            <p className='section-kicker mb-3'>Product system</p>
            <MotionH2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='max-w-xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl'
            >
              A complete career workflow, designed like a premium AI workspace.
            </MotionH2>
          </div>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className='max-w-2xl text-base leading-7 text-slate-600 md:justify-self-end'
          >
            The platform now favors high-signal guidance: crisp hierarchy, restrained motion, accessible state language, and reusable interface patterns that can scale across every career workflow.
          </MotionP>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => (
            <MotionDiv
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              whileHover={{ y: -6 }}
              className='glass-panel group rounded-[1.15rem] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white md:p-7'
            >
              <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white'>
                {React.cloneElement(feature.icon, { size: 24 })}
              </div>
              <h3 className='mb-3 text-xl font-semibold text-slate-950'>{feature.title}</h3>
              <p className='leading-7 text-slate-600'>{feature.description}</p>
            </MotionDiv>
          ))}
        </div>

        <div className='mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]'>
          <MotionDiv
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='glass-panel overflow-hidden rounded-[1.15rem] p-5 md:p-7'
          >
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <p className='text-xs font-bold uppercase tracking-[0.14em] text-blue-600'>Candidate journey</p>
                <h3 className='mt-2 text-2xl font-semibold tracking-tight'>From discovery to offer</h3>
              </div>
              <span className='rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700'>Live flow</span>
            </div>
            <div className='grid gap-3 md:grid-cols-4'>
              {['Discover', 'Evaluate', 'Apply', 'Advance'].map((step, index) => (
                <div key={step} className='rounded-xl border border-slate-200 bg-slate-50/80 p-4'>
                  <span className='text-xs font-bold text-slate-400'>0{index + 1}</span>
                  <p className='mt-8 font-semibold text-slate-950'>{step}</p>
                  <div className='mt-3 h-1.5 rounded-full bg-slate-200'>
                    <div className='h-full rounded-full bg-blue-600' style={{ width: `${92 - index * 14}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className='glass-panel rounded-[1.15rem] p-5 md:p-7'
          >
            <p className='text-xs font-bold uppercase tracking-[0.14em] text-amber-600'>Signal quality</p>
            <h3 className='mt-2 text-2xl font-semibold tracking-tight'>Less volume. Better intent.</h3>
            <p className='mt-4 leading-7 text-slate-600'>The interface highlights only what helps candidates and recruiters make a confident next move.</p>
            <div className='mt-6 grid grid-cols-2 gap-3'>
              <Stat value='3.8x' label='faster comparison' />
              <Stat value='64%' label='fewer stale leads' />
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  )
}

const Stat = ({ value, label }) => (
  <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
    <p className='text-2xl font-semibold text-slate-950'>{value}</p>
    <p className='mt-1 text-xs text-slate-500'>{label}</p>
  </div>
)

export default Features
