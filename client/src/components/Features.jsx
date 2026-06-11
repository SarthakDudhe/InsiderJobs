import React from 'react'
import { motion } from 'framer-motion'
import { BrainCircuit, Gauge, Globe2, LineChart, MessageSquare, ShieldCheck } from 'lucide-react'

const MotionH2 = motion.h2
const MotionP = motion.p
const MotionDiv = motion.div

const features = [
  {
    icon: <BrainCircuit />,
    title: 'AI-guided matching',
    description: 'Recommendations use resume context and role signals so candidates see work that actually fits.'
  },
  {
    icon: <Gauge />,
    title: 'Fast, focused search',
    description: 'Clean filters and readable listings help users compare roles without the usual job-board noise.'
  },
  {
    icon: <Globe2 />,
    title: 'Market-wide discovery',
    description: 'Find opportunities across locations, seniority bands, and hiring teams from one polished workspace.'
  },
  {
    icon: <ShieldCheck />,
    title: 'Verified companies',
    description: 'Company-led postings and recruiter controls make every interaction feel accountable.'
  },
  {
    icon: <MessageSquare />,
    title: 'Recruiter clarity',
    description: 'Applicants, resumes, and status decisions stay organized in a premium dashboard flow.'
  },
  {
    icon: <LineChart />,
    title: 'Career tracking',
    description: 'Application history and status chips turn the process into a clear pipeline instead of a black box.'
  }
]

const Features = () => {
  return (
    <section className='bg-white py-24'>
      <div className='ij-container'>
        <div className='mb-14 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end'>
          <div>
            <p className='section-kicker mb-3'>Product system</p>
            <MotionH2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-3xl font-extrabold leading-tight text-gray-950 md:text-5xl'
            >
              A career platform that feels built, not assembled.
            </MotionH2>
          </div>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className='max-w-2xl text-base leading-relaxed text-gray-600 md:justify-self-end'
          >
            The redesign gives every core flow a consistent rhythm: refined surfaces, useful motion, crisp status language, and interactions that feel deliberate.
          </MotionP>
        </div>

        <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => (
            <MotionDiv
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              whileHover={{ y: -6 }}
              className='premium-panel group rounded-[1.35rem] p-6 transition-all duration-300 hover:border-blue-200 hover:shadow-[0_20px_45px_rgba(37,99,235,0.1)] md:p-7'
            >
              <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-950 text-white transition-transform duration-300 group-hover:scale-105 group-hover:bg-blue-600'>
                {React.cloneElement(feature.icon, { size: 24 })}
              </div>
              <h3 className='mb-3 text-xl font-extrabold text-gray-950'>{feature.title}</h3>
              <p className='leading-relaxed text-gray-600'>{feature.description}</p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
