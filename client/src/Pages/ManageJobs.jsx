import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../LoaderFront/Loader'
import { Plus } from 'lucide-react'

const ManageJobs = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState(false)
  const { backendUrl, companyToken } = useContext(AppContext)

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/company/list-jobs', {
        headers: { token: companyToken }
      })

      if (data.success) {
        setJobs(data.jobsData.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/company/change-visibility',
        { id },
        { headers: { token: companyToken } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchCompanyJobs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs()
    }
  }, [companyToken])

  return jobs ? jobs.length === 0 ? (
    <div className='flex h-[70vh] flex-col items-center justify-center text-center'>
      <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm'>
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
      <div className='mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
        <div>
          <p className='section-kicker'>Pipeline control</p>
          <h1 className='mt-2 text-3xl font-extrabold text-gray-950'>Manage jobs</h1>
          <p className='mt-2 text-gray-600'>You have {jobs.length} active job listings.</p>
        </div>
        <button onClick={() => navigate('/dashboard/add-job')} className='premium-button cursor-pointer px-5 py-3 text-sm'>
          <Plus size={17} /> Post New Job
        </button>
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
                      <span className={`ml-3 text-xs font-extrabold uppercase tracking-wider ${job.visible ? 'text-green-600' : 'text-gray-400'}`}>
                        {job.visible ? 'Active' : 'Hidden'}
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
  ) : (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <Loader />
    </div>
  )
}

export default ManageJobs
