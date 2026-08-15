import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'
import JobQuickViewDrawer from './JobQuickViewDrawer'
import { CheckCircle2, Filter, SearchX, SlidersHorizontal, Sparkles, Target, TimerReset, X } from 'lucide-react'

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
  const clearFilters = () => {
    setSearchFilter({ title: '', location: '' })
    setSelectedCategories([])
    setSelectedLocation([])
    setCurrentPage(1)
  }

  return (
    <div className='ij-container py-8'>
      <div className='grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start'>
        <aside className='overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.08)] lg:sticky lg:top-24'>
          <div className='border-b border-slate-200 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50/40 p-5'>
            <div className='flex items-center justify-between gap-4'>
              <div>
                <p className='section-kicker'>Discovery console</p>
                <h3 className='mt-2 text-xl font-semibold tracking-tight text-slate-950'>Tune your search signals</h3>
              </div>
              <button onClick={() => setShowFilter(prev => !prev)} className='ij-focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden' aria-label='Toggle filters'>
                {showFilter ? <X size={18} /> : <Filter size={18} />}
              </button>
            </div>
            <div className='mt-5 grid grid-cols-3 gap-2'>
              <ConsoleStat value={totalJobs} label='roles' />
              <ConsoleStat value='92%' label='fit' />
              <ConsoleStat value={activeFilterCount} label='signals' />
            </div>
            <div className='mt-5 rounded-2xl border border-slate-200 bg-white/85 p-3 shadow-sm'>
              <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500'>
                <Target size={14} className='text-blue-600' /> Search intent
              </div>
              <p className='mt-2 text-sm leading-6 text-slate-600'>
                {searchFilter.title || searchFilter.location ? `${searchFilter.title || 'Any role'} in ${searchFilter.location || 'any location'}` : 'Open discovery across verified roles'}
              </p>
            </div>
          </div>

          <div className='p-5'>
            {isSearched && (searchFilter.title !== '' || searchFilter.location !== '') && (
              <div className='mb-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4'>
                <p className='mb-3 text-xs font-bold uppercase tracking-[0.14em] text-blue-700'>Active query</p>
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
              <div className='mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400'>
                  <SlidersHorizontal size={14} className='text-blue-600' /> Match controls
                </div>
                <div className='mt-4 space-y-3'>
                  <SignalMeter label='Fit confidence' value='92%' width='92%' />
                  <SignalMeter label='Freshness bias' value='High' width='78%' />
                  <SignalMeter label='Filter precision' value={activeFilterCount ? 'Focused' : 'Broad'} width={activeFilterCount ? '68%' : '38%'} />
                </div>
              </div>
              <FilterGroup title='Categories' items={JobCategories} selected={selectedCategories} onToggle={handleCategorychange} />
              <FilterGroup title='Location' items={JobLocations} selected={selectedLocation} onToggle={handleLocationchange} className='mt-8' />
              <button onClick={clearFilters} className='mt-6 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50'>
                Reset console
              </button>
            </div>
          </div>
        </aside>

        <section className='w-full'>
          <div className='mb-5 rounded-[1.15rem] border border-slate-200 bg-white/90 p-4 shadow-sm'>
            <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
            <div>
              <h2 className='text-xl font-bold text-slate-950'>Recommended roles</h2>
              <p className='mt-1 text-sm text-slate-600'>Sorted for fit, freshness, company signal, and response velocity.</p>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <ResultChip icon={<Sparkles />} label='AI ranked' />
              <ResultChip icon={<CheckCircle2 />} label='Verified' />
              <ResultChip icon={<TimerReset />} label='Fresh first' />
              <span className='status-chip w-fit border border-slate-200 bg-white text-slate-600'>{totalJobs} roles</span>
            </div>
            </div>
          </div>

          {jobs.length > 0 ? (
            <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
              {jobs.map((job, index) => (
                <JobCard key={job._id || index} job={job} onQuickView={(selectedJob) => setQuickViewJob(selectedJob)} />
              ))}
            </div>
          ) : (
            <EmptyJobsState onClear={clearFilters} />
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

const ConsoleStat = ({ value, label }) => (
  <div className='rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm'>
    <p className='text-xl font-semibold tracking-tight text-slate-950'>{value}</p>
    <p className='mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400'>{label}</p>
  </div>
)

const SignalMeter = ({ label, value, width }) => (
  <div>
    <div className='mb-1.5 flex items-center justify-between gap-3 text-xs'>
      <span className='font-semibold text-slate-600'>{label}</span>
      <span className='font-bold text-slate-950'>{value}</span>
    </div>
    <div className='h-1.5 overflow-hidden rounded-full bg-slate-200'>
      <div className='h-full rounded-full bg-blue-600' style={{ width }} />
    </div>
  </div>
)

const ResultChip = ({ icon, label }) => (
  <span className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600'>
    {React.cloneElement(icon, { size: 13, className: 'text-blue-600' })}
    {label}
  </span>
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
