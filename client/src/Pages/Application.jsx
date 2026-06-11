import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FileText, UploadCloud } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Application = () => {
  const { user } = useUser()
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)

  const { backendUrl, userData, userApplications, fetchUserData, fetchUserApplications } = useContext(AppContext)

  const updateResume = async () => {
    try {
      const formData = new FormData()
      formData.append('resume', resume)

      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/users/update-resume', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        toast.success(data.message)
        await fetchUserData()
      } else {
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
    <div className='min-h-screen ij-shell'>
      <Navbar />
      <main className='ij-container min-h-[65vh] py-10'>
        <div className='mb-8'>
          <p className='section-kicker'>Career command center</p>
          <h1 className='mt-2 text-3xl font-extrabold text-gray-950 md:text-5xl'>Applications</h1>
          <p className='mt-2 max-w-2xl text-gray-600'>Manage your resume and track every opportunity from submission to decision.</p>
        </div>

        <section className='premium-panel mb-8 rounded-[1.5rem] p-6'>
          <div className='mb-5 flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700'>
              <FileText size={21} />
            </div>
            <div>
              <h2 className='text-xl font-extrabold text-gray-950'>Your Resume</h2>
              <p className='text-sm text-gray-500'>Used by the AI recommender and job applications.</p>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-3'>
            {isEdit || (userData && userData.resume === '') ? (
              <>
                <label className='group flex cursor-pointer items-center' htmlFor='resumeUpload'>
                  <div className='inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-5 py-3 font-bold text-blue-700 transition-colors group-hover:bg-blue-100'>
                    {resume ? resume.name : 'Select PDF Resume'}
                    <UploadCloud size={18} />
                  </div>
                  <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} type='file' hidden accept='application/pdf' />
                </label>
                <button className='rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-green-700 active:scale-95' onClick={updateResume}>
                  Save Changes
                </button>
                {isEdit && <button onClick={() => setIsEdit(false)} className='px-4 font-bold text-gray-500 hover:text-gray-800'>Cancel</button>}
              </>
            ) : (
              <div className='flex items-center gap-3'>
                {userData && userData.resume !== '' && (
                  <a target='_blank' rel='noopener noreferrer' href={userData.resume} className='premium-button px-6 py-3'>
                    View Resume
                  </a>
                )}
                <button onClick={() => setIsEdit(true)} className='rounded-xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50'>
                  Edit Resume
                </button>
              </div>
            )}
          </div>
        </section>

        <section className='premium-panel overflow-hidden rounded-[1.5rem]'>
          <div className='border-b border-gray-200 p-6'>
            <h2 className='text-xl font-extrabold text-gray-950'>Applied Jobs History</h2>
            <p className='mt-1 text-sm text-gray-500'>A clean view of your active hiring pipeline.</p>
          </div>

          <div className='hidden overflow-x-auto md:block'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200 bg-gray-50 text-sm uppercase tracking-[0.12em] text-gray-500'>
                  <th className='px-4 py-4 text-left font-extrabold'>Company</th>
                  <th className='px-4 py-4 text-left font-extrabold'>Position</th>
                  <th className='px-4 py-4 text-left font-extrabold'>Location</th>
                  <th className='px-4 py-4 text-left font-extrabold'>Date Applied</th>
                  <th className='px-4 py-4 text-left font-extrabold'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {userApplications.map((job, index) => (
                  <tr key={index} className='transition-colors hover:bg-blue-50/30'>
                    <td className='px-4 py-5'>
                      <div className='flex items-center gap-3'>
                        <img className='h-10 w-10 rounded-xl border border-gray-200 bg-white object-contain p-1' src={job.companyId.image} alt='' />
                        <span className='font-extrabold text-gray-950'>{job.companyId.name}</span>
                      </div>
                    </td>
                    <td className='px-4 py-5 font-bold text-gray-700'>{job.jobId.title}</td>
                    <td className='px-4 py-5 text-gray-500'>{job.jobId.location}</td>
                    <td className='px-4 py-5 text-sm text-gray-500'>{moment(job.date).format('MMM D, YYYY')}</td>
                    <td className='px-4 py-5'>
                      <Status status={job.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='space-y-4 p-4 md:hidden'>
            {userApplications.map((job, index) => (
              <div key={index} className='rounded-2xl border border-gray-200 bg-gray-50/70 p-4'>
                <div className='mb-3 flex items-center gap-3'>
                  <img className='h-12 w-12 rounded-xl border border-gray-200 bg-white object-contain p-1' src={job.companyId.image} alt='' />
                  <div>
                    <h3 className='font-extrabold text-gray-950'>{job.jobId.title}</h3>
                    <p className='text-sm text-gray-600'>{job.companyId.name}</p>
                  </div>
                </div>
                <div className='mb-4 grid grid-cols-2 gap-2 text-xs'>
                  <div>
                    <span className='font-bold uppercase tracking-[0.1em] text-gray-400'>Location</span>
                    <p className='font-semibold text-gray-700'>{job.jobId.location}</p>
                  </div>
                  <div className='text-right'>
                    <span className='font-bold uppercase tracking-[0.1em] text-gray-400'>Date</span>
                    <p className='font-semibold text-gray-700'>{moment(job.date).format('ll')}</p>
                  </div>
                </div>
                <div className='flex items-center justify-between border-t border-gray-200 pt-3'>
                  <span className='text-xs font-bold uppercase tracking-[0.12em] text-gray-400'>Status</span>
                  <Status status={job.status} />
                </div>
              </div>
            ))}
          </div>

          {userApplications.length === 0 && (
            <div className='py-20 text-center'>
              <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50'>
                <FileText className='text-blue-600' size={30} />
              </div>
              <p className='font-bold text-gray-500'>No job applications found yet.</p>
              <button onClick={() => navigate('/')} className='mt-4 font-extrabold text-blue-600 hover:underline'>
                Browse latest jobs
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

const Status = ({ status }) => (
  <span className={`status-chip ${status === 'Accepted' ? 'border border-green-100 bg-green-50 text-green-700' : status === 'Rejected' ? 'border border-red-100 bg-red-50 text-red-700' : 'border border-amber-100 bg-amber-50 text-amber-700'}`}>
    {status}
  </span>
)

export default Application
