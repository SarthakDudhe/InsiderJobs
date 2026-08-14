import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'
import JobQuickViewDrawer from './JobQuickViewDrawer'
import { BrainCircuit, BriefcaseBusiness, Filter, Gauge, SearchX, SlidersHorizontal, X } from 'lucide-react'

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs, totalJobs, fetchJobs } = useContext(AppContext)
  const [showFilter, setShowFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedLocation, setSelectedLocation] = useState([])
  const [quickViewJob, setQuickViewJob] = useState(null)

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

  const activeFilterCount = selectedCategories.length + selectedLocation.length + (searchFilter.title ? 1 : 0) + (searchFilter.location ? 1 : 0)
  const totalPages = Math.ceil(totalJobs / 6)

  return (
    <div className='ij-container py-10'>
      <div className='mb-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]'>
        <div>
          <p className='section-kicker'>Job discovery</p>
          <h1 className='mt-2 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl' id='job-list'>
            Search with context, compare with confidence.
          </h1>
          <p className='mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base'>
            Verified roles are organized by fit signals, company responsiveness, and your active search intent.
          </p>
        </div>
        <div className='grid gap-3 sm:grid-cols-3 lg:self-end'>
          <InsightTile icon={<BriefcaseBusiness />} value={totalJobs} label='open roles' />
          <InsightTile icon={<Gauge />} value='92%' label='avg. AI fit' />
          <InsightTile icon={<BrainCircuit />} value={activeFilterCount} label='active signals' />
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start'>
        <aside className='premium-panel w-full rounded-[1.15rem] p-5 lg:sticky lg:top-24'>
          <div className='mb-5 flex items-center justify-between'>
            <div>
              <p className='section-kicker'>Filters</p>
              <h3 className='mt-1 text-xl font-bold text-slate-950'>Refine matches</h3>
            </div>
            <button onClick={() => setShowFilter(prev => !prev)} className='ij-focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden' aria-label='Toggle filters'>
              {showFilter ? <X size={18} /> : <Filter size={18} />}
            </button>
          </div>

          {isSearched && (searchFilter.title !== '' || searchFilter.location !== '') && (
            <div className='mb-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4'>
              <p className='mb-3 text-sm font-bold text-slate-950'>Current search</p>
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
            <div className='mb-6 rounded-xl border border-slate-200 bg-slate-50/80 p-3'>
              <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400'>
                <SlidersHorizontal size={14} /> Match controls
              </div>
              <p className='mt-2 text-xs leading-5 text-slate-600'>Use a few strong filters. The workspace stays optimized for comparison.</p>
            </div>
            <FilterGroup title='Categories' items={JobCategories} selected={selectedCategories} onToggle={handleCategorychange} />
            <FilterGroup title='Location' items={JobLocations} selected={selectedLocation} onToggle={handleLocationchange} className='mt-8' />
          </div>
        </aside>

        <section className='w-full'>
          <div className='mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
            <div>
              <h2 className='text-xl font-bold text-slate-950'>Recommended roles</h2>
              <p className='mt-1 text-sm text-slate-600'>Sorted for fit, freshness, and hiring activity.</p>
            </div>
            <span className='status-chip w-fit border border-slate-200 bg-white text-slate-600'>{totalJobs} roles</span>
          </div>

          {jobs.length > 0 ? (
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
              {jobs.map((job, index) => (
                <JobCard key={job._id || index} job={job} onQuickView={(selectedJob) => setQuickViewJob(selectedJob)} />
              ))}
            </div>
          ) : (
            <EmptyJobsState onClear={() => {
              setSearchFilter({ title: '', location: '' })
              setSelectedCategories([])
              setSelectedLocation([])
            }} />
          )}

          {totalJobs > 0 && totalPages > 1 && (
            <div className='mt-10 flex items-center justify-center gap-2'>
              <a onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} href='#job-list' className='rounded-xl border border-slate-200 bg-white p-2 shadow-sm'>
                <img src={assets.left_arrow_icon} alt='Previous' />
              </a>
              {Array.from({ length: totalPages }).map((_, index) => (
                <a key={index} href='#job-list'>
                  <button onClick={() => setCurrentPage(index + 1)} className={`h-9 w-9 cursor-pointer rounded-xl border text-sm font-bold transition-all ${currentPage === index + 1 ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-950'}`}>
                    {index + 1}
                  </button>
                </a>
              ))}
              <a onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} href='#job-list' className='rounded-xl border border-slate-200 bg-white p-2 shadow-sm'>
                <img src={assets.right_arrow_icon} alt='Next' />
              </a>
            </div>
          )}
        </section>
      </div>

      {/* Quick View Drawer Modal */}
      {quickViewJob && (
        <JobQuickViewDrawer job={quickViewJob} onClose={() => setQuickViewJob(null)} />
      )}
    </div>
  )
}

const FilterGroup = ({ title, items, selected, onToggle, className = '' }) => (
  <div className={className}>
    <h4 className='mb-4 text-sm font-bold uppercase tracking-[0.12em] text-slate-400'>{title}</h4>
    <ul className='space-y-3 text-slate-700'>
      {items.map((item, index) => (
        <li className='group flex cursor-pointer items-center gap-3' key={index} onClick={() => onToggle(item)}>
          <input className='h-4 w-4 cursor-pointer rounded accent-blue-600' type='checkbox' onChange={(e) => e.stopPropagation()} checked={selected.includes(item)} />
          <span className='font-semibold transition-colors group-hover:text-blue-700'>{item}</span>
        </li>
      ))}
    </ul>
  </div>
)

const InsightTile = ({ icon, value, label }) => (
  <div className='premium-panel rounded-[1rem] p-4'>
    {React.cloneElement(icon, { size: 18, className: 'text-blue-600' })}
    <p className='mt-3 text-2xl font-semibold tracking-tight text-slate-950'>{value}</p>
    <p className='text-xs font-bold uppercase tracking-[0.12em] text-slate-400'>{label}</p>
  </div>
)

const EmptyJobsState = ({ onClear }) => (
  <div className='premium-panel flex min-h-[360px] flex-col items-center justify-center rounded-[1.15rem] p-8 text-center'>
    <div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600'>
      <SearchX size={24} />
    </div>
    <h3 className='mt-5 text-xl font-bold text-slate-950'>No high-fit roles found</h3>
    <p className='mt-2 max-w-md text-sm leading-6 text-slate-600'>Try widening the role, location, or category filters. InsiderJobs will keep the results focused as new roles become available.</p>
    <button onClick={onClear} className='premium-button mt-6 px-5 py-3 text-sm'>
      Clear filters
    </button>
  </div>
)

export default JobListing
