import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const JobCard = ({ job }) => {
  const navigate = useNavigate()

  const openJob = () => {
    navigate(`/apply-job/${job._id}`)
    scrollTo(0, 0)
  }

  return (
    <div className='group premium-panel flex h-full flex-col justify-between rounded-[1.35rem] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_55px_rgba(37,99,235,0.12)] sm:p-6'>
      <div>
        <div className='mb-5 flex items-start justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 p-2 shadow-sm'>
              <img className='h-8 w-8 object-contain' src={job.companyId.image} alt={job.companyId.name} />
            </div>
            <div>
              <p className='text-xs font-bold uppercase tracking-[0.14em] text-gray-400'>{job.companyId.name}</p>
              <div className='flex items-center gap-1.5 mt-0.5'>
                <p className='text-xs font-semibold text-blue-600'>Verified role</p>
                <span className='text-gray-300'>•</span>
                {(job.hiringActivity || 'stale') === 'active' && (
                  <span className='inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider'>
                    <span className='relative flex h-1.5 w-1.5'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                      <span className='relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500'></span>
                    </span>
                    Active Hiring
                  </span>
                )}
                {(job.hiringActivity || 'stale') === 'slow' && (
                  <span className='inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 uppercase tracking-wider'>
                    <span className='h-1.5 w-1.5 rounded-full bg-amber-500'></span>
                    Slow Activity
                  </span>
                )}
                {(job.hiringActivity || 'stale') === 'stale' && (
                  <span className='inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase tracking-wider'>
                    <span className='h-1.5 w-1.5 rounded-full bg-rose-500'></span>
                    Likely Stale
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className='status-chip border border-blue-100 bg-blue-50 text-blue-700'>New</span>
        </div>

        <h4 className='mb-3 line-clamp-2 text-lg font-extrabold leading-snug text-gray-950 transition-colors group-hover:text-blue-700 sm:text-xl'>{job.title}</h4>

        <div className='mb-5 flex flex-wrap items-center gap-2'>
          <span className='inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700'>
            <img src={assets.location_icon} alt='' className='h-3 w-3' />
            {job.location}
          </span>
          <span className='inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700'>
            <img src={assets.person_icon} alt='' className='h-3 w-3' />
            {job.level}
          </span>
        </div>

        <p
          className='mb-6 line-clamp-2 min-h-10 overflow-hidden text-sm leading-relaxed text-gray-500'
          dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}
        />
      </div>

      <div className='flex gap-3 text-sm font-bold'>
        <button className='premium-button flex-1 px-4 py-3' onClick={openJob}>
          Apply <ArrowRight size={16} />
        </button>
        <button className='flex-1 cursor-pointer rounded-xl border border-gray-200 px-4 py-3 text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-95' onClick={openJob}>
          Details
        </button>
      </div>
    </div>
  )
}

export default JobCard
