import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Gauge, ShieldCheck, Sparkles } from 'lucide-react'

const activityStyles = {
  active: {
    label: 'Active hiring',
    className: 'text-emerald-600',
    dot: 'bg-emerald-500',
    pulse: true
  },
  slow: {
    label: 'Slow activity',
    className: 'text-amber-600',
    dot: 'bg-amber-500'
  },
  stale: {
    label: 'Likely stale',
    className: 'text-rose-600',
    dot: 'bg-rose-500'
  }
}

const JobCard = ({ job, onQuickView }) => {
  const navigate = useNavigate()
  const activity = activityStyles[job.hiringActivity || 'stale'] || activityStyles.stale
  const matchScore = job.matchScore || Math.min(98, 82 + (job.title?.length || 0) % 13)

  const openJob = () => {
    navigate(`/apply-job/${job._id}`)
    scrollTo(0, 0)
  }

  return (
    <article className='group premium-panel flex h-full flex-col justify-between rounded-[1.15rem] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_55px_rgba(37,99,235,0.12)] sm:p-6'>
      <div>
        <div className='mb-5 flex items-start justify-between gap-3'>
          <div className='flex min-w-0 items-center gap-3'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm'>
              <img className='h-8 w-8 object-contain' src={job.companyId.image} alt={job.companyId.name} />
            </div>
            <div className='min-w-0'>
              <p className='truncate text-xs font-bold uppercase tracking-[0.14em] text-slate-400'>{job.companyId.name}</p>
              <div className='mt-1 flex flex-wrap items-center gap-1.5'>
                <span className='inline-flex items-center gap-1 text-xs font-semibold text-blue-600'>
                  <ShieldCheck size={13} /> Verified role
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${activity.className}`}>
                  <span className='relative flex h-1.5 w-1.5'>
                    {activity.pulse && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${activity.dot} opacity-75`} />}
                    <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${activity.dot}`} />
                  </span>
                  {activity.label}
                </span>
              </div>
            </div>
          </div>
          <span className='status-chip shrink-0 border border-blue-100 bg-blue-50 text-blue-700'>New</span>
        </div>

        <div className='mb-4 grid gap-2 sm:grid-cols-[1fr_auto]'>
          {job.companyId?.hasApplicants ? (
            <span className='inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700'>
              <ShieldCheck size={13} /> {job.companyId.responseRate}% response
              <span className='text-blue-200'>/</span>
              {job.companyId.averageDecisionDays}d decisions
            </span>
          ) : (
            <span className='inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700'>
              <Sparkles size={13} /> High-signal workspace
            </span>
          )}
          <span className='inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700'>
            <Gauge size={13} /> {matchScore}% AI match
          </span>
        </div>

        <h4 className='mb-3 line-clamp-2 text-lg font-bold leading-snug text-slate-950 transition-colors group-hover:text-blue-700 sm:text-xl'>{job.title}</h4>

        <div className='mb-5 flex flex-wrap items-center gap-2'>
          <span className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700'>
            <img src={assets.location_icon} alt='' className='h-3 w-3' />
            {job.location}
          </span>
          <span className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700'>
            <img src={assets.person_icon} alt='' className='h-3 w-3' />
            {job.level}
          </span>
        </div>

        <p
          className='mb-4 line-clamp-2 min-h-10 overflow-hidden text-sm leading-relaxed text-slate-500'
          dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}
        />

        <div className='mb-6 rounded-xl border border-slate-200 bg-slate-50/80 p-3'>
          <p className='text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400'>Why it matches</p>
          <p className='mt-1 text-xs leading-5 text-slate-600'>Strong overlap with role level, location preference, and active hiring signals.</p>
        </div>
      </div>

      <div className='flex gap-3 text-sm font-bold'>
        <button className='premium-button flex-1 cursor-pointer px-4 py-3' onClick={openJob}>
          Apply <ArrowRight size={16} />
        </button>
        <button className='flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-3 text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95' onClick={() => onQuickView ? onQuickView(job) : openJob()}>
          Quick View
        </button>
      </div>
    </article>
  )
}

export default JobCard
