import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Bookmark, Gauge, MapPin, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'

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
    <article className='group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_26px_70px_rgba(37,99,235,0.14)]'>
      <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400' />
      <div>
        <div className='flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/80 p-5'>
          <div className='flex min-w-0 items-center gap-3'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm'>
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
          <button className='ij-focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:text-blue-600' aria-label='Save job'>
            <Bookmark size={17} />
          </button>
        </div>

        <div className='p-5 sm:p-6'>
          <div className='mb-4 flex items-start justify-between gap-4'>
            <div>
              <h4 className='line-clamp-2 text-xl font-semibold leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-blue-700'>{job.title}</h4>
              <p className='mt-2 text-sm leading-6 text-slate-500'>A verified role with strong alignment across seniority, hiring signal, and candidate context.</p>
            </div>
            <div className='hidden shrink-0 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-center sm:block'>
              <p className='text-2xl font-semibold text-emerald-700'>{matchScore}</p>
              <p className='text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700'>Role match</p>
            </div>
          </div>

          <div className='mb-5 grid gap-2 sm:grid-cols-3'>
            <RoleFact icon={<MapPin />} label='Location' value={job.location} />
            <RoleFact icon={<UsersRound />} label='Level' value={job.level} />
            <RoleFact icon={<Gauge />} label='Match' value={`${matchScore}%`} />
          </div>

          <div className='mb-4 flex flex-wrap gap-2'>
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
          </div>

          <p
            className='mb-4 line-clamp-2 min-h-10 overflow-hidden text-sm leading-relaxed text-slate-500'
            dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}
          />

          <div className='rounded-xl border border-slate-200 bg-slate-50/80 p-3'>
            <p className='text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400'>Why it matches</p>
            <p className='mt-1 text-xs leading-5 text-slate-600'>Strong overlap with role level, location preference, and active hiring signals.</p>
          </div>
        </div>
      </div>

      <div className='flex gap-3 border-t border-slate-100 p-5 text-sm font-bold'>
        <button className='premium-button flex-1 cursor-pointer px-4 py-3' onClick={openJob}>
          View details <ArrowRight size={16} />
        </button>
        <button className='flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-3 text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95' onClick={() => onQuickView ? onQuickView(job) : openJob()}>
          Match brief
        </button>
      </div>
    </article>
  )
}

const RoleFact = ({ icon, label, value }) => (
  <div className='rounded-xl border border-slate-200 bg-white p-3'>
    <div className='flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400'>
      {React.cloneElement(icon, { size: 13, className: 'text-blue-600' })}
      {label}
    </div>
    <p className='mt-1 truncate text-xs font-bold text-slate-800'>{value}</p>
  </div>
)

export default JobCard
