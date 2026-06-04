import React, { useContext, useEffect, useState } from 'react'
import { manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../LoaderFront/Loader'
const ManageJobs = () => {

  const navigate = useNavigate()

  const [jobs, setJobs] = useState(false)

  const { backendUrl, companyToken } = useContext(AppContext)

  //Function to fetch company Job Application data

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/list-jobs", {
        headers: { token: companyToken }
      })

      if (data.success) {
        setJobs(data.jobsData.reverse())
        console.log(data.jobsData);

      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  //function to change job visibilty
  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/company/change-visibility',
        { id },
        { headers: { token: companyToken } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchCompanyJobs()
      }
      else {
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
    <div className='flex flex-col items-center justify-center h-[70vh] text-center'>
      <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4'>
        <span className='text-4xl'>📁</span>
      </div>
      <p className='text-xl font-bold text-gray-900'>No jobs found</p>
      <p className='text-gray-500 mt-2'>Start by posting your first job opening.</p>
      <button
        onClick={() => navigate("/dashboard/add-job")}
        className='mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all cursor-pointer'
      >
        Add New Job
      </button>
    </div>
  ) : (
    <div className='container mx-auto p-4 sm:p-6 max-w-6xl'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>Manage Your Jobs</h2>
            <p className='text-gray-500 text-sm'>You have {jobs.length} active job listings.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/add-job")}
            className='bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-blue-700 transition-all cursor-pointer text-sm flex items-center justify-center gap-2'
          >
            <span>+</span> Post New Job
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-bold'>
                <th className='py-4 px-6 border-b border-gray-100 max-sm:hidden'>#</th>
                <th className='py-4 px-6 border-b border-gray-100'>Job Details</th>
                <th className='py-4 px-6 border-b border-gray-100 max-sm:hidden'>Location</th>
                <th className='py-4 px-6 border-b border-gray-100 text-center'>Applicants</th>
                <th className='py-4 px-6 border-b border-gray-100'>Visibility</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {jobs.map((job, index) => (
                <tr key={index} className='hover:bg-gray-50/50 transition-colors group'>
                  <td className='py-5 px-6 max-sm:hidden text-gray-400 font-medium'>{index + 1}</td>
                  <td className='py-5 px-6'>
                    <div>
                      <div className='font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>{job.title}</div>
                      <div className='text-xs text-gray-500 mt-1 sm:hidden'>📍 {job.location}</div>
                      <div className='text-xs text-gray-400 mt-1'>{moment(job.date).format('MMM D, YYYY')}</div>
                    </div>
                  </td>
                  <td className='py-5 px-6 max-sm:hidden'>
                    <span className='inline-flex items-center gap-1.5 text-gray-600 text-sm'>
                      📍 {job.location}
                    </span>
                  </td>
                  <td className='py-5 px-6 text-center'>
                    <div className='inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm'>
                      {job.applicants}
                    </div>
                  </td>
                  <td className='py-5 px-6'>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        checked={job.visible}
                        onChange={() => changeJobVisibility(job._id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className={`ml-3 text-xs font-bold uppercase tracking-wider ${job.visible ? 'text-green-600' : 'text-gray-400'}`}>
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
    <div className='flex items-center justify-center min-h-[60vh]'>
      <Loader />
    </div>
  )

}

export default ManageJobs