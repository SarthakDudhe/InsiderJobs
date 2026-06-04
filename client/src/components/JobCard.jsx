import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const JobCard = ({ job }) => {


  const navigate = useNavigate();


  return (
    <div className='group bg-white border border-gray-100 p-5 sm:p-6 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between'>
      <div>
        <div className='flex justify-between items-start mb-4'>
          <div className='p-2 bg-gray-50 rounded-xl border border-gray-100 shadow-sm'>
            <img className='h-8 w-8 object-contain' src={job.companyId.image} alt={job.companyId.name} />
          </div>
          <span className='text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wider'>
            New
          </span>
        </div>

        <h4 className='font-bold text-lg sm:text-xl text-gray-900 group-hover:text-blue-600 transition-colors truncate mb-2'>{job.title}</h4>

        <div className='flex flex-wrap items-center gap-2 mb-4'>
          <span className='inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-100'>
            <img src={assets.location_icon} alt="" className='w-3 h-3' />
            {job.location}
          </span>
          <span className='inline-flex items-center gap-1.5 bg-purple-50 text-purple-600 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg border border-purple-100'>
            <img src={assets.person_icon} alt="" className='w-3 h-3' />
            {job.level}
          </span>
        </div>

        <p className='text-gray-500 text-sm line-clamp-2 leading-relaxed mb-6 h-10 overflow-hidden'
          dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}></p>
      </div>

      <div className='flex gap-3 text-xs sm:text-sm font-bold'>
        <button
          className='flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl cursor-pointer hover:bg-blue-700 transition-all shadow-md active:scale-95'
          onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }}
        >
          Apply Now
        </button>
        <button
          className='flex-1 text-gray-600 border border-gray-200 rounded-xl px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-all active:scale-95'
          onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }}
        >
          Learn more
        </button>
      </div>
    </div>
  )
}

export default JobCard