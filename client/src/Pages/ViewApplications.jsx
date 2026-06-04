import React, { useContext, useEffect, useState } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../LoaderFront/Loader'




const ViewApplications = () => {

  const { backendUrl, companyToken } = useContext(AppContext)

  const [applicants, setApplicants] = useState(false)

  //function to fetch company job applicants data

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/company/applicants', {
        headers: { token: companyToken }
      })
      if (data.success) {
        setApplicants(data.applications.reverse())
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //function to update the job application status

  const changeJobStatus = async (id, status) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/company/change-status", { id, status }, { headers: { token: companyToken } })
      if (data.success) {
        fetchCompanyJobs()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }


  useEffect(() => {
    fetchCompanyJobs()
  }, [companyToken])



  return applicants ? applicants.length === 0 ? (
    <div className='flex flex-col items-center justify-center h-[70vh] text-center'>
      <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4'>
        <span className='text-4xl'>👥</span>
      </div>
      <p className='text-xl font-bold text-gray-900'>No applications yet</p>
      <p className='text-gray-500 mt-2'>Applications for your posted jobs will appear here.</p>
    </div>
  ) : (
    <div className='container mx-auto p-4 sm:p-6 max-w-6xl'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='p-6 border-b border-gray-100'>
          <h2 className='text-xl font-bold text-gray-900'>Candidate Applications</h2>
          <p className='text-gray-500 text-sm'>Review and manage your job applicants.</p>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-bold'>
                <th className='py-4 px-6 border-b border-gray-100 max-sm:hidden'>#</th>
                <th className='py-4 px-6 border-b border-gray-100'>Candidate</th>
                <th className='py-4 px-6 border-b border-gray-100 max-sm:hidden'>Applied For</th>
                <th className='py-4 px-6 border-b border-gray-100'>Resume</th>
                <th className='py-4 px-6 border-b border-gray-100'>Status / Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {applicants.filter(item => item.jobId && item.userId).map((applicant, index) => (
                <tr key={index} className='hover:bg-gray-50/50 transition-colors group'>
                  <td className='py-5 px-6 max-sm:hidden text-gray-400 font-medium'>{index + 1}</td>
                  <td className='py-5 px-6'>
                    <div className='flex items-center gap-3'>
                      <img className='w-10 h-10 rounded-full border border-gray-100 shadow-sm' src={applicant.userId.image} alt="" />
                      <div>
                        <div className='font-bold text-gray-900'>{applicant.userId.name}</div>
                        <div className='text-xs text-gray-500 sm:hidden mt-1'>{applicant.jobId.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className='py-5 px-6 max-sm:hidden'>
                    <div>
                      <div className='font-medium text-gray-700 text-sm'>{applicant.jobId.title}</div>
                      <div className='text-xs text-gray-400 mt-0.5'>📍 {applicant.jobId.location}</div>
                    </div>
                  </td>
                  <td className='py-5 px-6 text-center'>
                    {applicant.userId.resume ? (
                      <a
                        className='inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100'
                        href={applicant.userId.resume}
                        target='_blank'
                        rel='noreferrer'
                      >
                        View <img className='w-3' src={assets.resume_download_icon} alt="" />
                      </a>
                    ) : (
                      <span className='text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100'>No Resume</span>
                    )}
                  </td>
                  <td className='py-5 px-6 relative'>
                    {applicant.status === "Pending" ? (
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => changeJobStatus(applicant._id, "Accepted")}
                          className='p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all border border-green-100 shadow-sm'
                          title='Accept'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M5 13l4 4L19 7'></path></svg>
                        </button>
                        <button
                          onClick={() => changeJobStatus(applicant._id, "Rejected")}
                          className='p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all border border-red-100 shadow-sm'
                          title='Reject'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M6 18L18 6M6 6l12 12'></path></svg>
                        </button>
                      </div>
                    ) : (
                      <div className='flex items-center gap-3'>
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${applicant.status === "Accepted" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                          {applicant.status}
                        </span>
                        <button
                          onClick={() => changeJobStatus(applicant._id, "Pending")}
                          className='text-gray-400 hover:text-blue-600 transition-colors'
                          title='Reset'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'></path></svg>
                        </button>
                      </div>
                    )}
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

export default ViewApplications