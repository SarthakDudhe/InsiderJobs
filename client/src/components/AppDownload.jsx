import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { Bell, QrCode } from 'lucide-react'

const MotionDiv = motion.div
const MotionA = motion.a
const MotionImg = motion.img

const AppDownload = () => {
  return (
    <section className='bg-[#f5f7fb] py-24 text-slate-950'>
      <div className='ij-container'>
        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-6 shadow-[0_35px_100px_rgba(15,23,42,0.12)] md:p-12'
        >
        <div className='relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row'>
          <div className='flex-1 text-center md:text-left'>
            <p className='section-kicker mb-3'>Mobile workspace</p>
            <h2 className='mb-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl'>
              Track the right opportunity before it goes cold.
            </h2>
            <p className='mx-auto mb-8 max-w-xl text-sm leading-7 text-slate-600 md:mx-0 md:text-base'>
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

              <div className='hidden items-center gap-3 border-l border-slate-200 pl-4 lg:flex'>
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
            <div className='absolute -left-6 top-10 hidden rounded-2xl border border-slate-200 bg-white/88 p-3 text-left shadow-[0_18px_45px_rgba(15,23,42,0.1)] backdrop-blur md:block'>
              <Bell size={16} className='mb-2 text-cyan-300' />
              <p className='text-xs font-bold'>3 new matches</p>
              <p className='text-[11px] text-slate-500'>Based on your resume</p>
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
      </div>
    </section>
  )
}

export default AppDownload
