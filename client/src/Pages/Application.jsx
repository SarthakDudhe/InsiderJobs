import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FileText, UploadCloud } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Application = () => {
  const navigate = useNavigate()
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)

  const { backendUrl, userToken, userData, userApplications, fetchUserData, fetchUserApplications } = useContext(AppContext)

  const updateResume = async () => {
    try {
      const formData = new FormData()
      formData.append('resume', resume)

      const token = userToken
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
    if (userToken) {
      fetchUserApplications()
    }
  }, [userToken])

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

        {userData && (userData.skills?.length > 0 || userData.experience?.length > 0 || userData.education?.length > 0) && (
          <section className='premium-panel mb-8 rounded-[1.5rem] p-6 bg-gradient-to-br from-white via-white to-blue-50/20'>
            <div className='mb-6 flex items-center justify-between border-b border-gray-100 pb-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm'>
                  <span className='font-bold text-lg'>★</span>
                </div>
                <div>
                  <h2 className='text-xl font-extrabold text-gray-950'>AI Developer Profile</h2>
                  <p className='text-sm text-gray-500'>Auto-extracted from your parsed resume.</p>
                </div>
              </div>
              
              {/* Profile Social Links */}
              <div className='flex gap-2'>
                {userData.links?.github && (
                  <a href={userData.links.github} target='_blank' rel='noopener noreferrer' className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors' title='GitHub'>
                    <svg className='h-4 w-4 fill-current' viewBox='0 0 24 24'><path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/></svg>
                  </a>
                )}
                {userData.links?.linkedin && (
                  <a href={userData.links.linkedin} target='_blank' rel='noopener noreferrer' className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 transition-colors' title='LinkedIn'>
                    <svg className='h-4 w-4 fill-current' viewBox='0 0 24 24'><path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'/></svg>
                  </a>
                )}
                {userData.links?.portfolio && (
                  <a href={userData.links.portfolio} target='_blank' rel='noopener noreferrer' className='flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-700 hover:bg-purple-100 transition-colors font-bold text-xs' title='Portfolio'>
                    W
                  </a>
                )}
              </div>
            </div>

            <div className='grid gap-6 md:grid-cols-[1fr_2fr]'>
              {/* Left Column: Skills */}
              <div className='space-y-4 border-b border-gray-100 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6'>
                <h3 className='text-xs font-bold uppercase tracking-wider text-gray-400'>Technical Skills</h3>
                <div className='flex flex-wrap gap-1.5'>
                  {userData.skills?.map((skill, index) => (
                    <span key={index} className='rounded-lg bg-slate-50 border border-slate-200/60 px-2.5 py-1 text-xs font-semibold text-slate-700'>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Experience and Education */}
              <div className='space-y-6'>
                {/* Experience */}
                {userData.experience?.length > 0 && (
                  <div>
                    <h3 className='mb-3 text-xs font-bold uppercase tracking-wider text-gray-400'>Experience</h3>
                    <div className='space-y-3'>
                      {userData.experience.map((exp, index) => (
                        <div key={index} className='flex items-start justify-between rounded-xl bg-slate-50/50 border border-slate-100 p-3'>
                          <div>
                            <p className='font-bold text-gray-900 text-sm'>{exp.role}</p>
                            <p className='text-xs text-gray-500 mt-0.5'>{exp.company}</p>
                          </div>
                          <span className='rounded-lg bg-blue-50/60 px-2 py-0.5 text-[10px] font-bold text-blue-700'>
                            {exp.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {userData.education?.length > 0 && (
                  <div>
                    <h3 className='mb-3 text-xs font-bold uppercase tracking-wider text-gray-400'>Education</h3>
                    <div className='space-y-3'>
                      {userData.education.map((edu, index) => (
                        <div key={index} className='flex items-start justify-between rounded-xl bg-slate-50/50 border border-slate-100 p-3'>
                          <div>
                            <p className='font-bold text-gray-900 text-sm'>{edu.degree}</p>
                            <p className='text-xs text-gray-500 mt-0.5'>{edu.school}</p>
                          </div>
                          <span className='rounded-lg bg-emerald-50/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700'>
                            {edu.year}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

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
