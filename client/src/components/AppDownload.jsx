import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { Bell, BrainCircuit, CheckCircle2, QrCode } from 'lucide-react'

const MotionDiv = motion.div
const MotionA = motion.a
const MotionImg = motion.img

const AppDownload = () => {
  return (
    <section className='bg-[var(--ij-canvas)] py-24 text-slate-950'>
      <div className='ij-container'>
        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='relative overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-[0_35px_100px_rgba(15,23,42,0.12)] md:p-12'
        >
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(37,99,235,0.09),transparent_28rem),radial-gradient(circle_at_88%_20%,rgba(6,182,212,0.08),transparent_24rem)]' />
        <div className='relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row'>
          <div className='flex-1 text-center md:text-left'>
            <p className='section-kicker mb-3'>Mobile workspace</p>
            <h2 className='mb-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl'>
              Carry your career workspace into every follow-up.
            </h2>
            <p className='mx-auto mb-8 max-w-xl text-sm leading-7 text-slate-600 md:mx-0 md:text-base'>
              Keep match alerts, application stages, interview reminders, and AI prep plans close so every next step stays visible.
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
                  <p className='text-[10px] text-slate-500'>iOS & Android</p>
                </div>
              </div>
            </div>
          </div>

          <div className='relative flex justify-center md:w-1/3'>
            <div className='absolute -left-6 top-10 hidden rounded-2xl border border-slate-200 bg-white/90 p-3 text-left shadow-[0_18px_45px_rgba(15,23,42,0.1)] backdrop-blur md:block'>
              <Bell size={16} className='mb-2 text-blue-600' />
              <p className='text-xs font-bold'>3 new matches</p>
              <p className='text-[11px] text-slate-500'>Based on your resume</p>
            </div>
            <div className='absolute -right-7 bottom-12 hidden rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-left shadow-[0_18px_45px_rgba(15,23,42,0.1)] md:block'>
              <CheckCircle2 size={16} className='mb-2 text-emerald-600' />
              <p className='text-xs font-bold text-emerald-900'>Interview prep ready</p>
              <p className='text-[11px] text-emerald-700'>6 focused prompts</p>
            </div>
            <div className='absolute -right-4 top-2 hidden h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-[0_18px_45px_rgba(15,23,42,0.1)] md:flex'>
              <BrainCircuit size={18} />
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
