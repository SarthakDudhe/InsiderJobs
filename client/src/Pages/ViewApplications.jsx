import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../LoaderFront/Loader'
import { Check, RotateCcw, UsersRound, X } from 'lucide-react'

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext)
  const [applicants, setApplicants] = useState(false)

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/company/applicants', {
        headers: { token: companyToken }
      })
      if (data.success) {
        setApplicants(data.applications.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeJobStatus = async (id, status) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/company/change-status', { id, status }, { headers: { token: companyToken } })
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
    <div className='flex h-[70vh] flex-col items-center justify-center text-center'>
      <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm'>
        <UsersRound className='text-blue-600' size={30} />
      </div>
      <p className='text-xl font-extrabold text-gray-950'>No applications yet</p>
      <p className='mt-2 text-gray-500'>Applications for your posted jobs will appear here.</p>
    </div>
  ) : (
    <div className='mx-auto max-w-6xl'>
      <div className='mb-6'>
        <p className='section-kicker'>Candidate review</p>
        <h1 className='mt-2 text-3xl font-extrabold text-gray-950'>Applications</h1>
        <p className='mt-2 text-gray-600'>Review resumes and move candidates through the hiring pipeline.</p>
      </div>

      <div className='premium-panel overflow-hidden rounded-[1.5rem]'>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-left'>
            <thead>
              <tr className='border-b border-gray-200 bg-gray-50 text-xs font-extrabold uppercase tracking-[0.12em] text-gray-500'>
                <th className='px-6 py-4 max-sm:hidden'>#</th>
                <th className='px-6 py-4'>Candidate</th>
                <th className='px-6 py-4 max-sm:hidden'>Applied For</th>
                <th className='px-6 py-4'>Resume</th>
                <th className='px-6 py-4'>Status / Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {applicants.filter(item => item.jobId && item.userId).map((applicant, index) => (
                <tr key={applicant._id || index} className='group transition-colors hover:bg-blue-50/30'>
                  <td className='px-6 py-5 font-semibold text-gray-400 max-sm:hidden'>{index + 1}</td>
                  <td className='px-6 py-5'>
                    <div className='flex items-center gap-3'>
                      <img className='h-11 w-11 rounded-full border border-gray-200 object-cover p-0.5 shadow-sm' src={applicant.userId.image} alt='' />
                      <div>
                        <div className='font-extrabold text-gray-950'>{applicant.userId.name}</div>
                        <div className='mt-1 text-xs text-gray-500 sm:hidden'>{applicant.jobId.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-5 max-sm:hidden'>
                    <div>
                      <div className='text-sm font-bold text-gray-800'>{applicant.jobId.title}</div>
                      <div className='mt-0.5 text-xs text-gray-400'>{applicant.jobId.location}</div>
                    </div>
                  </td>
                  <td className='px-6 py-5'>
                    {applicant.userId.resume ? (
                      <a className='inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-700 transition-all hover:bg-blue-100' href={applicant.userId.resume} target='_blank' rel='noreferrer'>
                        View <img className='w-3' src={assets.resume_download_icon} alt='' />
                      </a>
                    ) : (
                      <span className='rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-400'>No Resume</span>
                    )}
                  </td>
                  <td className='px-6 py-5'>
                    {applicant.status === 'Pending' ? (
                      <div className='flex items-center gap-2'>
                        <button onClick={() => changeJobStatus(applicant._id, 'Accepted')} className='rounded-xl border border-green-100 bg-green-50 p-2 text-green-700 transition-all hover:bg-green-100' title='Accept'>
                          <Check size={17} />
                        </button>
                        <button onClick={() => changeJobStatus(applicant._id, 'Rejected')} className='rounded-xl border border-red-100 bg-red-50 p-2 text-red-700 transition-all hover:bg-red-100' title='Reject'>
                          <X size={17} />
                        </button>
                      </div>
                    ) : (
                      <div className='flex items-center gap-3'>
                        <span className={`status-chip ${applicant.status === 'Accepted' ? 'border border-green-100 bg-green-50 text-green-700' : 'border border-red-100 bg-red-50 text-red-700'}`}>
                          {applicant.status}
                        </span>
                        <button onClick={() => changeJobStatus(applicant._id, 'Pending')} className='text-gray-400 transition-colors hover:text-blue-600' title='Reset'>
                          <RotateCcw size={16} />
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
    <div className='flex min-h-[60vh] items-center justify-center'>
      <Loader />
    </div>
  )
}

export default ViewApplications
