import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'
import { Filter, X } from 'lucide-react'

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs, totalJobs, fetchJobs } = useContext(AppContext)
  const [showFilter, setShowFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedLocation, setSelectedLocation] = useState([])

  const handleCategorychange = (category) => {
    setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category])
    setCurrentPage(1)
  }

  const handleLocationchange = (location) => {
    setSelectedLocation(prev => prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location])
    setCurrentPage(1)
  }

  // Reset page when search filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchFilter])

  // Fetch jobs from server whenever filters or page change
  useEffect(() => {
    fetchJobs(
      currentPage,
      6,
      searchFilter.title,
      searchFilter.location,
      selectedCategories.join(','),
      selectedLocation.join(',')
    )
  }, [currentPage, selectedCategories, selectedLocation, searchFilter])

  return (
    <div className='ij-container flex flex-col gap-8 py-10 lg:flex-row lg:items-start'>
      <aside className='premium-panel w-full rounded-[1.35rem] p-5 lg:sticky lg:top-24 lg:w-1/4'>
        <div className='mb-5 flex items-center justify-between'>
          <div>
            <p className='section-kicker'>Filters</p>
            <h3 className='mt-1 text-xl font-extrabold text-gray-950'>Refine jobs</h3>
          </div>
          <button onClick={() => setShowFilter(prev => !prev)} className='inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 lg:hidden'>
            {showFilter ? <X size={18} /> : <Filter size={18} />}
          </button>
        </div>

        {isSearched && (searchFilter.title !== '' || searchFilter.location !== '') && (
          <div className='mb-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4'>
            <p className='mb-3 text-sm font-extrabold text-gray-950'>Current search</p>
            <div className='flex flex-wrap gap-2 text-sm font-semibold text-blue-700'>
              {searchFilter.title && (
                <button className='inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm' onClick={() => setSearchFilter(prev => ({ ...prev, title: '' }))}>
                  {searchFilter.title} <X size={14} />
                </button>
              )}
              {searchFilter.location && (
                <button className='inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm' onClick={() => setSearchFilter(prev => ({ ...prev, location: '' }))}>
                  {searchFilter.location} <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        <div className={showFilter ? 'block' : 'max-lg:hidden'}>
          <FilterGroup title='Categories' items={JobCategories} selected={selectedCategories} onToggle={handleCategorychange} />
          <FilterGroup title='Location' items={JobLocations} selected={selectedLocation} onToggle={handleLocationchange} className='mt-8' />
        </div>
      </aside>

      <section className='w-full lg:w-3/4'>
        <div className='mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
          <div>
            <p className='section-kicker'>Open roles</p>
            <h3 className='mt-2 text-3xl font-extrabold text-gray-950' id='job-list'>Latest Jobs</h3>
            <p className='mt-2 text-gray-600'>Curated opportunities from verified hiring teams.</p>
          </div>
          <span className='status-chip w-fit border border-gray-200 bg-white text-gray-600'>{totalJobs} roles</span>
        </div>

        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
          {jobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>

        {totalJobs > 0 && (
          <div className='mt-10 flex items-center justify-center gap-2'>
            <a onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} href='#job-list' className='rounded-xl border border-gray-200 bg-white p-2 shadow-sm'>
              <img src={assets.left_arrow_icon} alt='Previous' />
            </a>
            {Array.from({ length: Math.ceil(totalJobs / 6) }).map((_, index) => (
              <a key={index} href='#job-list'>
                <button onClick={() => setCurrentPage(index + 1)} className={`h-9 w-9 cursor-pointer rounded-xl border text-sm font-bold transition-all ${currentPage === index + 1 ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100' : 'border-gray-200 bg-white text-gray-500 hover:text-gray-950'}`}>
                  {index + 1}
                </button>
              </a>
            ))}
            <a onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(totalJobs / 6)))} href='#job-list' className='rounded-xl border border-gray-200 bg-white p-2 shadow-sm'>
              <img src={assets.right_arrow_icon} alt='Next' />
            </a>
          </div>
        )}
      </section>
    </div>
  )
}

const FilterGroup = ({ title, items, selected, onToggle, className = '' }) => (
  <div className={className}>
    <h4 className='mb-4 text-sm font-extrabold uppercase tracking-[0.12em] text-gray-400'>{title}</h4>
    <ul className='space-y-3 text-gray-700'>
      {items.map((item, index) => (
        <li className='group flex cursor-pointer items-center gap-3' key={index} onClick={() => onToggle(item)}>
          <input className='h-4 w-4 cursor-pointer rounded accent-blue-600' type='checkbox' onChange={(e) => e.stopPropagation()} checked={selected.includes(item)} />
          <span className='font-semibold transition-colors group-hover:text-blue-700'>{item}</span>
        </li>
      ))}
    </ul>
  </div>
)

export default JobListing
