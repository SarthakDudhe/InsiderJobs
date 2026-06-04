import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'

const JobListing = () => {

    const { isSearched, searchFilter, setSearchFilter, setIsSearched, jobs, setjobs } = useContext(AppContext)
    const [showFilter, setShowFilter] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedLocation, setSelectedLocation] = useState([])
    const [filteredJobs, setFilteredJobs] = useState(jobs)

    const handleCategorychange = (category) => {
        setSelectedCategories(
            prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )                            //if selected category is their       if not their it will be included
        // it will be removed
    }

    const handleLocationchange = (location) => {
        setSelectedLocation(
            prev => prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]
        )                            //if selected location is their       if not their it will be included
        // it will be removed
    }


    useEffect(() => {
        const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category)
        const matchesLocation = job => selectedLocation.length === 0 || selectedLocation.includes(job.location)

        const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())
        const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())
        const newFilteredJobs = jobs.slice().reverse().filter(
            job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
        )

        setFilteredJobs(newFilteredJobs)
        setCurrentPage(1)
    }, [jobs, selectedCategories, selectedLocation, searchFilter])



    return (
        <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8 px-4 sm:px-0'>
            {/* Sidebar */}
            <div className='w-full lg:w-1/4 bg-white px-4'>

                {/* Search filter from hero Component */}
                {
                    isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
                        <>
                            <h3 className='font-medium text-lg mb-4'>Current Search </h3>
                            <div className='mb-4 text-gray-600'>
                                {searchFilter.title && (
                                    <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                                        {searchFilter.title}
                                        <img onClick={e => setSearchFilter(prev => ({ ...prev, title: "" }))} src={assets.cross_icon} className='cursor-pointer' />
                                    </span>
                                )}

                                {searchFilter.location && (
                                    <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded' >
                                        {searchFilter.location}
                                        <img onClick={e => setSearchFilter(prev => ({ ...prev, location: "" }))} src={assets.cross_icon} className='cursor-pointer' />
                                    </span>
                                )}


                            </div>

                        </>
                    )}
                <button onClick={e => setShowFilter(prev => !prev)} className='flex items-center gap-2 px-6 py-2 rounded-xl border border-gray-200 lg:hidden cursor-pointer hover:bg-gray-50 transition-colors font-medium text-gray-700 bg-white shadow-sm'>
                    <span className='p-1 bg-blue-50 text-blue-600 rounded-md'>{showFilter ? "✕" : "🔍"}</span>
                    {showFilter ? "Close Filters" : "Filter Jobs"}
                </button>

                {/* Category Filter */}
                <div className={showFilter ? "block" : "max-lg:hidden"}>
                    <h4 className='font-bold text-gray-900 py-4 flex items-center gap-2'>
                        <span className='w-1 h-4 bg-blue-600 rounded-full'></span>
                        Categories
                    </h4>
                    <ul className='space-y-3 text-gray-600 ml-3'>
                        {
                            JobCategories.map((category, index) => (
                                <li className='flex gap-3 items-center group cursor-pointer' key={index} onClick={() => handleCategorychange(category)}>
                                    <input className='scale-125 accent-blue-600 cursor-pointer rounded' type="checkbox" onChange={(e) => e.stopPropagation()} checked={selectedCategories.includes(category)} />
                                    <span className='group-hover:text-blue-600 transition-colors'>{category}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>


                {/* Location Filter */}
                <div className={showFilter ? "block" : "max-lg:hidden"}>
                    <h4 className='font-bold text-gray-900 py-4 pt-10 flex items-center gap-2'>
                        <span className='w-1 h-4 bg-purple-600 rounded-full'></span>
                        Location
                    </h4>
                    <ul className='space-y-3 text-gray-600 ml-3'>
                        {
                            JobLocations.map((location, index) => (
                                <li className='flex gap-3 items-center group cursor-pointer' key={index} onClick={() => handleLocationchange(location)}>
                                    <input className='scale-125 accent-purple-600 cursor-pointer rounded' type="checkbox" onChange={(e) => e.stopPropagation()} checked={selectedLocation.includes(location)} />
                                    <span className='group-hover:text-purple-600 transition-colors'>{location}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>

            </div>


            {/* Job Listings */}
            <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
                <h3 className='font-medium text-3xl py-2' id='job-list' >Latest Jobs</h3>
                <p className='mb-8'>Get your desired job from top companies</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
                        <JobCard key={index} job={job} />
                    ))}
                </div>

                {/* Pagination */}
                {filteredJobs.length > 0 && (
                    <div className='flex items-center justify-center space-x-2 mt-10'>
                        <a onClick={() => setCurrentPage(Math.max(currentPage - 1), 1)} href="#job-list">
                            <img src={assets.left_arrow_icon} alt="" />
                        </a>
                        {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
                            <a key={index} href="#job-list">
                                <button onClick={() => setCurrentPage(index + 1)} className={`w-8 h-8 items-center justify-center border border-gray-300 rounded cursor-pointer ${currentPage === index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'}`}>
                                    {index + 1}
                                </button>
                            </a>
                        ))}
                        <a onClick={() => setCurrentPage(Math.min(currentPage + 1), Math.ceil(filteredJobs.length / 6))} href="#job-list">
                            <img src={assets.right_arrow_icon} alt="" />
                        </a>
                    </div>
                )}
            </section>
        </div>
    )
}

export default JobListing