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



  return applicants ? applicants.length === 0 ? (<div className='flex items-center justify-center h-[70vh]'><p className='text-xl sm:text-2xl'>No Applications found</p></div>
  ) : (
    <div className='container mx-auto p-4'>
      <div>
        <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr className='border-b'>
              <th className='py-2 px-4 text-left'>#</th>
              <th className='py-2 px-4 text-left'>User Name</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-left'>Resume</th>
              <th className='py-2 px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.filter(item => item.jobId && item.userId).map((applicant, index) => (
              <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b text-center'>{index + 1}</td>
                <td className='py-2 px-4 border-b text-center flex items-center'>
                  <img className='w-10 h-10 rounded-full mr-3 max-sm:hidden' src={applicant.userId.image} alt="" />
                  <span>{applicant.userId.name}</span>
                </td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobId.title}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobId.location}</td>
                <td className='py-2 px-4 border-b'>
                  {applicant.userId.resume ? (
                    <a className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center' href={applicant.userId.resume} target='_blank'>Resume <img src={assets.resume_download_icon} alt="" /></a>
                  ) : (
                    <span className='text-gray-400'>No Resume</span>
                  )}
                </td>
                <td className='py-2 px-4 border-b relative'>
                  {applicant.status === "Pending" ?
                    <div className='relative inline-block text-left group'>
                      <button className='text-gray-500 action-button cursor-pointer'>...</button>
                      <div className='z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                        <button onClick={() => changeJobStatus(applicant._id, "Accepted")} className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100 cursor-pointer'>Accept</button>
                        <button onClick={() => changeJobStatus(applicant._id, "Rejected")} className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer'>Reject</button>
                      </div>
                    </div> :
                    <div className='flex gap-2 items-center'>
                      <span className={`${applicant.status === "Accepted" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"} px-4 py-1.5 rounded`}>{applicant.status}</span>
                      <button onClick={() => changeJobStatus(applicant._id, "Pending")} className='text-gray-500 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100'>Reset</button>
                    </div>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <div className="fixed inset-0 flex items-center justify-center">
    <Loader />
  </div>
}

export default ViewApplications