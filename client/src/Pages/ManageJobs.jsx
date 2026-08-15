import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../LoaderFront/Loader'
import { BriefcaseBusiness, Eye, EyeOff, Plus, RefreshCw, UsersRound } from 'lucide-react'
import { readRecruiterCache, writeRecruiterCache } from '../utils/recruiterCache'

const ManageJobs = () => {
  const navigate = useNavigate()
  const { backendUrl, companyToken } = useContext(AppContext)
  const cached = readRecruiterCache(companyToken)
  const [jobs, setJobs] = useState(cached?.jobs || [])
  const [hasLoaded, setHasLoaded] = useState(Boolean(cached?.jobs))
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchCompanyJobs = async ({ silent = false } = {}) => {
    if (!silent) setIsRefreshing(true)
    try {
      const { data } = await axios.get(backendUrl + '/api/company/list-jobs', {
        headers: { token: companyToken }
      })

      if (data.success) {
        const nextJobs = [...(data.jobsData || [])].reverse()
        setJobs(nextJobs)
        setHasLoaded(true)
        writeRecruiterCache(companyToken, { jobs: nextJobs })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      if (!silent) toast.error(error.message)
    } finally {
      setIsRefreshing(false)
    }
  }

  const changeJobVisibility = async (id) => {
    const previousJobs = jobs
    const nextJobs = jobs.map(job => job._id === id ? { ...job, visible: !job.visible } : job)
    setJobs(nextJobs)
    writeRecruiterCache(companyToken, { jobs: nextJobs })

    try {
      const { data } = await axios.post(
        backendUrl + '/api/company/change-visibility',
        { id },
        { headers: { token: companyToken } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchCompanyJobs({ silent: true })
      } else {
        setJobs(previousJobs)
        writeRecruiterCache(companyToken, { jobs: previousJobs })
        toast.error(data.message)
      }
    } catch (error) {
      setJobs(previousJobs)
      writeRecruiterCache(companyToken, { jobs: previousJobs })
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs({ silent: hasLoaded })
      const interval = setInterval(() => {
        fetchCompanyJobs({ silent: true })
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [companyToken])

  const visibleJobs = jobs.filter(job => job.visible).length
  const hiddenJobs = jobs.length - visibleJobs
  const applicants = jobs.reduce((total, job) => total + (Number(job.applicants) || 0), 0)

  if (!hasLoaded) {
    return (
      <RecruiterLoading label='Loading recruiter postings' />
    )
  }

  return jobs.length === 0 ? (
    <div className='flex h-[70vh] flex-col items-center justify-center text-center'>
      <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-100 bg-blue-50 shadow-sm'>
        <Plus className='text-blue-600' size={30} />
      </div>
      <p className='text-xl font-extrabold text-gray-950'>No jobs found</p>
      <p className='mt-2 text-gray-500'>Start by posting your first job opening.</p>
      <button onClick={() => navigate('/dashboard/add-job')} className='premium-button mt-6 cursor-pointer px-6 py-3'>
        Add New Job
      </button>
    </div>
  ) : (
    <div className='mx-auto max-w-6xl'>
      <div className='mb-6 grid gap-5 xl:grid-cols-[1fr_420px] xl:items-end'>
        <div>
          <p className='section-kicker'>Pipeline control</p>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl'>Recruiter postings workspace</h1>
          <p className='mt-3 max-w-2xl text-sm leading-7 text-slate-600'>Cached listings appear instantly while visibility, applicant counts, and fresh posting data sync in the background.</p>
        </div>
        <div className='grid gap-3 sm:grid-cols-3'>
          <RecruiterStat icon={<BriefcaseBusiness />} label='Postings' value={jobs.length} />
          <RecruiterStat icon={<Eye />} label='Visible' value={visibleJobs} tone='emerald' />
          <RecruiterStat icon={<UsersRound />} label='Applicants' value={applicants} tone='cyan' />
        </div>
      </div>

      <div className='mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm'>
        <div className='flex flex-wrap gap-2 text-xs font-bold text-slate-500'>
          <span className='rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-emerald-700'>{visibleJobs} active</span>
          <span className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5'>{hiddenJobs} hidden</span>
        </div>
        <div className='flex items-center gap-2'>
          <button onClick={() => fetchCompanyJobs()} className='inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:text-blue-600' title='Refresh postings'>
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => navigate('/dashboard/add-job')} className='premium-button cursor-pointer px-5 py-3 text-sm'>
            <Plus size={17} /> Post job
          </button>
        </div>
      </div>

      <div className='premium-panel overflow-hidden rounded-[1.5rem]'>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-left'>
            <thead>
              <tr className='border-b border-gray-200 bg-gray-50 text-xs font-extrabold uppercase tracking-[0.12em] text-gray-500'>
                <th className='px-6 py-4 max-sm:hidden'>#</th>
                <th className='px-6 py-4'>Job Details</th>
                <th className='px-6 py-4 max-sm:hidden'>Location</th>
                <th className='px-6 py-4 text-center'>Applicants</th>
                <th className='px-6 py-4'>Visibility</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {jobs.map((job, index) => (
                <tr key={job._id || index} className='group transition-colors hover:bg-blue-50/30'>
                  <td className='px-6 py-5 font-semibold text-gray-400 max-sm:hidden'>{index + 1}</td>
                  <td className='px-6 py-5'>
                    <div>
                      <div className='font-extrabold text-gray-950 transition-colors group-hover:text-blue-700'>{job.title}</div>
                      <div className='mt-1 text-xs text-gray-500 sm:hidden'>{job.location}</div>
                      <div className='mt-1 text-xs font-semibold text-gray-400'>{moment(job.date).format('MMM D, YYYY')}</div>
                    </div>
                  </td>
                  <td className='px-6 py-5 max-sm:hidden'>
                    <span className='text-sm font-semibold text-gray-600'>{job.location}</span>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-blue-50 px-3 text-sm font-extrabold text-blue-700'>
                      {job.applicants}
                    </div>
                  </td>
                  <td className='px-6 py-5'>
                    <label className='relative inline-flex cursor-pointer items-center'>
                      <input type='checkbox' className='peer sr-only' checked={job.visible} onChange={() => changeJobVisibility(job._id)} />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100" />
                      <span className={`ml-3 inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider ${job.visible ? 'text-green-600' : 'text-gray-400'}`}>
                        {job.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                        {job.visible ? 'Live' : 'Hidden'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const RecruiterStat = ({ icon, label, value, tone = 'blue' }) => {
  const styles = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    cyan: 'border-cyan-100 bg-cyan-50 text-cyan-700'
  }[tone]

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${styles}`}>
      <div className='flex items-center justify-between'>
        {React.cloneElement(icon, { size: 18 })}
        <span className='text-2xl font-semibold'>{value}</span>
      </div>
      <p className='mt-3 text-[10px] font-bold uppercase tracking-[0.14em]'>{label}</p>
    </div>
  )
}

const RecruiterLoading = ({ label }) => (
  <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4'>
    <Loader />
    <p className='text-xs font-bold uppercase tracking-[0.14em] text-slate-400'>{label}</p>
  </div>
)

export default ManageJobs
