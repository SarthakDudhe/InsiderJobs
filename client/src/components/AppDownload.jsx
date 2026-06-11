import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { Bell, QrCode, Smartphone } from 'lucide-react'

const MotionDiv = motion.div
const MotionA = motion.a
const MotionImg = motion.img

const AppDownload = () => {
  return (
    <section className='ij-container my-20'>
      <MotionDiv
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='relative overflow-hidden rounded-[2rem] bg-gray-950 p-6 text-white shadow-[0_30px_80px_rgba(17,24,39,0.25)] md:p-12'
      >
        <div className='absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl' />
        <div className='relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row'>
          <div className='flex-1 text-center md:text-left'>
            <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-100'>
              <Smartphone size={14} /> Mobile workspace
            </div>
            <h2 className='mb-4 text-3xl font-extrabold leading-tight md:text-5xl'>
              Track the right opportunity before it goes cold.
            </h2>
            <p className='mx-auto mb-8 max-w-xl text-sm leading-relaxed text-gray-300 md:mx-0 md:text-base'>
              Keep alerts, applications, and AI recommendations close so the next step is always obvious.
            </p>

            <div className='flex flex-wrap items-center justify-center gap-4 md:justify-start'>
              <div className='flex gap-3'>
                <MotionA whileHover={{ y: -3 }} href='#' className='transition-all'>
                  <img className='h-10 rounded-lg' src={assets.play_store} alt='Play Store' />
                </MotionA>
                <MotionA whileHover={{ y: -3 }} href='#' className='transition-all'>
                  <img className='h-10 rounded-lg' src={assets.app_store} alt='App Store' />
                </MotionA>
              </div>

              <div className='hidden items-center gap-3 border-l border-white/15 pl-4 lg:flex'>
                <div className='rounded-xl bg-white p-2'>
                  <QrCode size={32} className='text-gray-950' />
                </div>
                <div className='text-left'>
                  <p className='text-[10px] font-bold uppercase tracking-wider'>Scan to Download</p>
                  <p className='text-[10px] text-blue-200'>iOS & Android</p>
                </div>
              </div>
            </div>
          </div>

          <div className='relative flex justify-center md:w-1/3'>
            <div className='absolute -left-6 top-10 hidden rounded-2xl border border-white/10 bg-white/10 p-3 text-left backdrop-blur md:block'>
              <Bell size={16} className='mb-2 text-blue-200' />
              <p className='text-xs font-bold'>3 new matches</p>
              <p className='text-[11px] text-gray-300'>Based on your resume</p>
            </div>
            <MotionImg
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='w-40 drop-shadow-2xl md:w-56'
              src={assets.app_main_img}
              alt='App Interface'
            />
          </div>
        </div>
      </MotionDiv>
    </section>
  )
}

export default AppDownload
