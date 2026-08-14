import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Bookmark, Briefcase, Clock, DollarSign, Gauge, MapPin, ShieldCheck, Sparkles, X, Zap } from 'lucide-react'

const JobQuickViewDrawer = ({ job, onClose }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [onClose])

  if (!job) return null

  const handleApply = () => {
    onClose()
    navigate(`/apply-job/${job._id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className='drawer-overlay' onClick={onClose} />

      <div className='drawer-content custom-scrollbar flex flex-col justify-between p-6 sm:p-8'>
        <div>
          <div className='mb-6 flex items-center justify-between border-b border-slate-100 pb-6'>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700'>
              <Sparkles size={13} className='text-blue-600' /> Match briefing
            </span>
            <button
              onClick={onClose}
              className='ij-focus-ring cursor-pointer rounded-full p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700'
              aria-label='Close drawer'
            >
              <X size={20} />
            </button>
          </div>

          <div className='mb-6 flex items-start gap-4'>
            <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-2.5 shadow-sm'>
              <img
                className='h-9 w-9 object-contain'
                src={job.companyId?.image || '/placeholder.png'}
                alt={job.companyId?.name || 'Company logo'}
              />
            </div>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.14em] text-slate-400'>
                {job.companyId?.name || 'Partner Company'}
              </p>
              <h2 className='mt-1 text-xl font-bold leading-snug text-slate-950 sm:text-2xl'>
                {job.title}
              </h2>
              <div className='mt-2 flex flex-wrap items-center gap-2'>
                <span className='inline-flex items-center gap-1 text-xs font-semibold text-blue-600'>
                  <ShieldCheck size={14} /> Verified posting
                </span>
                {(job.hiringActivity || 'active') === 'active' && (
                  <span className='inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600'>
                    <span className='relative flex h-2 w-2'>
                      <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
                      <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
                    </span>
                    Active hiring
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className='mb-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4'>
            <div className='flex items-start gap-3'>
              <div className='rounded-xl bg-white p-2 text-blue-600 shadow-sm'>
                <Gauge size={18} />
              </div>
              <div>
                <p className='text-sm font-bold text-slate-950'>AI match summary</p>
                <p className='mt-1 text-sm leading-6 text-slate-600'>
                  Strong alignment with role level, location preference, and verified hiring activity. Review the requirements, then use resume fit analysis before applying.
                </p>
              </div>
            </div>
          </div>

          <div className='mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4'>
            <Metric icon={<MapPin />} label='Location' value={job.location} tone='blue' />
            <Metric icon={<Briefcase />} label='Experience' value={job.level} tone='indigo' />
            <Metric
              icon={<DollarSign />}
              label='Salary range'
              value={job.salary ? `$${job.salary.toLocaleString()}/yr` : 'Competitive package'}
              tone='emerald'
            />
            <Metric
              icon={<Clock />}
              label='Response rate'
              value={`${job.companyId?.responseRate || 95}% in ~${job.companyId?.averageDecisionDays || 3}d`}
              tone='amber'
            />
          </div>

          <div className='mb-6'>
            <h3 className='mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900'>
              <Zap size={16} className='text-blue-600' /> About the role
            </h3>
            <div
              className='prose prose-sm max-w-none space-y-3 text-sm leading-relaxed text-slate-600'
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        </div>

        <div className='sticky bottom-0 mt-6 border-t border-slate-100 bg-white pt-6'>
          <div className='flex items-center gap-3'>
            <button className='ij-focus-ring inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50' aria-label='Save job'>
              <Bookmark size={18} />
            </button>
            <button
              onClick={handleApply}
              className='premium-button flex-1 px-6 py-3.5 text-sm font-bold shadow-lg shadow-blue-500/20'
            >
              Apply and analyze resume fit <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

const toneClassNames = {
  blue: 'bg-blue-100/60 text-blue-600',
  indigo: 'bg-indigo-100/60 text-indigo-600',
  emerald: 'bg-emerald-100/60 text-emerald-600',
  amber: 'bg-amber-100/60 text-amber-600'
}

const Metric = ({ icon, label, value, tone }) => (
  <div className='flex items-center gap-3'>
    <div className={`rounded-xl p-2 ${toneClassNames[tone]}`}>
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div>
      <p className='text-[11px] font-bold uppercase text-slate-400'>{label}</p>
      <p className='text-xs font-bold text-slate-800'>{value}</p>
    </div>
  </div>
)

export default JobQuickViewDrawer
