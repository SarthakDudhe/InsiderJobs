import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets, jobsApplied } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Application = () => {

  const { user } = useUser()
  const { getToken } = useAuth()
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)


  const { backendUrl, userData, userApplications, setUserData, setUserApplications, fetchUserData, fetchUserApplications } = useContext(AppContext)

  const updateResume = async () => {
    try {
      const formData = new FormData()
      console.log(resume)
      formData.append('resume', resume)

      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/users/update-resume', formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        await fetchUserData()
      }
      else {
        toast.error(data.message)
      }


    } catch (error) {
      toast.error(error.message)
    }

    setIsEdit(false)
    setResume(null)
  }

  useEffect(() => {
    if (user) {
      fetchUserApplications()
    }
  }, [user])

  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>

        {/* Resume Section */}
        <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8'>
          <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
            <span className='p-2 bg-blue-50 text-blue-600 rounded-lg'>📄</span>
            Your Resume
          </h2>
          <div className='flex flex-wrap gap-3 items-center'>
            {
              isEdit || (userData && userData.resume === "") ? (
                <>
                  <label className='flex items-center group cursor-pointer' htmlFor="resumeUpload">
                    <div className='bg-blue-50 text-blue-600 px-6 py-2.5 rounded-xl mr-2 group-hover:bg-blue-100 transition-colors flex items-center gap-2 font-medium'>
                      {resume ? resume.name : "Select PDF Resume"}
                      <img src={assets.profile_upload_icon} alt="" className='w-5' />
                    </div>
                    <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} type="file" hidden accept='application/pdf' />
                  </label>
                  <button
                    className='bg-green-600 text-white font-bold rounded-xl px-8 py-2.5 cursor-pointer hover:bg-green-700 transition-all shadow-md active:scale-95'
                    onClick={updateResume}
                  >
                    Save Changes
                  </button>
                  {isEdit && <button onClick={() => setIsEdit(false)} className='text-gray-500 hover:text-gray-700 font-medium px-4'>Cancel</button>}
                </>
              ) : (
                <div className='flex items-center gap-3'>
                  {userData && userData.resume !== "" && (
                    <a
                      target='_blank'
                      rel='noopener noreferrer'
                      href={userData.resume}
                      className='bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all'
                    >
                      View Resume
                    </a>
                  )}
                  <button
                    onClick={() => setIsEdit(true)}
                    className='text-blue-600 bg-blue-50 border border-blue-100 rounded-xl px-8 py-2.5 font-bold cursor-pointer hover:bg-blue-100 transition-all'
                  >
                    Edit Resume
                  </button>
                </div>
              )
            }
          </div>
        </div>

        {/* Jobs Applied Section */}
        <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm'>
          <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
            <span className='p-2 bg-purple-50 text-purple-600 rounded-lg'>💼</span>
            Applied Jobs History
          </h2>

          {/* Desktop Table */}
          <div className='hidden md:block overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='text-gray-500 text-sm uppercase tracking-wider border-b border-gray-100'>
                  <th className='py-4 px-4 text-left font-semibold'>Company</th>
                  <th className='py-4 px-4 text-left font-semibold'>Position</th>
                  <th className='py-4 px-4 text-left font-semibold'>Location</th>
                  <th className='py-4 px-4 text-left font-semibold'>Date Applied</th>
                  <th className='py-4 px-4 text-left font-semibold'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {userApplications.map((job, index) => (
                  <tr key={index} className='hover:bg-gray-50/50 transition-colors'>
                    <td className='py-5 px-4'>
                      <div className='flex items-center gap-3'>
                        <img className='w-10 h-10 rounded-lg border p-1 bg-white object-contain' src={job.companyId.image} alt="" />
                        <span className='font-bold text-gray-900'>{job.companyId.name}</span>
                      </div>
                    </td>
                    <td className='py-5 px-4 font-medium text-gray-700'>{job.jobId.title}</td>
                    <td className='py-5 px-4 text-gray-500'>
                      <span className='inline-flex items-center gap-1.5'>
                        📍 {job.jobId.location}
                      </span>
                    </td>
                    <td className='py-5 px-4 text-gray-500 text-sm'>{moment(job.date).format('MMM D, YYYY')}</td>
                    <td className='py-5 px-4'>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold leading-5 ${job.status === "Accepted" ? "bg-green-100 text-green-700" :
                          job.status === "Rejected" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                        }`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className='md:hidden space-y-4'>
            {userApplications.map((job, index) => (
              <div key={index} className='p-4 border border-gray-100 rounded-2xl bg-gray-50/50'>
                <div className='flex items-center gap-3 mb-3'>
                  <img className='w-12 h-12 rounded-xl border p-1 bg-white object-contain' src={job.companyId.image} alt="" />
                  <div>
                    <h3 className='font-bold text-gray-900'>{job.jobId.title}</h3>
                    <p className='text-sm text-gray-600'>{job.companyId.name}</p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-2 text-xs mb-4'>
                  <div className='flex flex-col'>
                    <span className='text-gray-400 uppercase font-bold tracking-tighter'>Location</span>
                    <span className='text-gray-700 font-medium'>{job.jobId.location}</span>
                  </div>
                  <div className='flex flex-col text-right'>
                    <span className='text-gray-400 uppercase font-bold tracking-tighter'>Date Applied</span>
                    <span className='text-gray-700 font-medium'>{moment(job.date).format('ll')}</span>
                  </div>
                </div>
                <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
                  <span className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Status</span>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${job.status === "Accepted" ? "bg-green-100 text-green-700" :
                      job.status === "Rejected" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                    }`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {userApplications.length === 0 && (
            <div className='py-20 text-center'>
              <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-4xl'>🤷‍♂️</span>
              </div>
              <p className='text-gray-500 font-medium'>No job applications found yet.</p>
              <button
                onClick={() => navigate('/')}
                className='mt-4 text-blue-600 font-bold hover:underline'
              >
                Browse latest jobs
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </ >
  )
}

export default Application