import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loader from '../LoaderFront/Loader'
import Navbar from '../components/Navbar'
import kConvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth, useClerk, useUser } from '@clerk/clerk-react'
import { Briefcase, CalendarClock, MapPin, Users } from 'lucide-react'

const ApplyJob = () => {
  const { id } = useParams()
  const { getToken } = useAuth()
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const navigate = useNavigate()
  const [jobData, setjobData] = useState(null)
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)
  const { jobs, backendUrl, userData, userApplications, fetchUserApplications } = useContext(AppContext)

  const fetchjob = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`)
      if (data.success) {
        setjobData(data.job)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const applyHandler = async () => {
    try {
      if (!user) return openSignIn()
      if (!userData) return toast.error('Login to apply for jobs')
      if (!userData.resume) {
        navigate('/applications')
        return toast.error('Upload Resume to Apply')
      }

      const token = await getToken()
      const { data } = await axios.post(
        backendUrl + '/api/users/apply',
        { jobId: jobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        fetchUserApplications()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some(item => item.jobId._id === jobData._id)
    setIsAlreadyApplied(hasApplied)
  }

  useEffect(() => {
    fetchjob()
  }, [id, jobs])

  useEffect(() => {
    if (userApplications.length > 0 && jobData) {
      checkAlreadyApplied()
    }
  }, [jobData, userApplications, id])

  return jobData ? (
    <div className='min-h-screen ij-shell'>
      <Navbar />
      <main className='ij-container py-10'>
        <section className='premium-card mb-8 rounded-[2rem] p-6 md:p-10'>
          <div className='flex flex-col justify-between gap-8 md:flex-row md:items-center'>
            <div className='flex flex-col items-center gap-5 text-center md:flex-row md:text-left'>
              <div className='flex h-24 w-24 items-center justify-center rounded-3xl border border-gray-200 bg-white p-4 shadow-sm'>
                <img className='max-h-16 object-contain' src={jobData.companyId.image} alt={jobData.companyId.name} />
              </div>
              <div>
                <p className='section-kicker mb-2'>{jobData.companyId.name}</p>
                <h1 className='text-3xl font-extrabold text-gray-950 md:text-5xl'>{jobData.title}</h1>
                <div className='mt-4 flex flex-wrap justify-center gap-3 text-sm font-semibold text-gray-600 md:justify-start'>
                  <Info icon={<Briefcase />} text={jobData.companyId.name} />
                  <Info icon={<MapPin />} text={jobData.location} />
                  <Info icon={<Users />} text={jobData.level} />
                  <Info icon={<CalendarClock />} text={`Posted ${moment(jobData.date).fromNow()}`} />
                  
                  {(jobData.hiringActivity || 'stale') === 'active' && (
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700 shadow-sm'>
                      <span className='relative flex h-2 w-2'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                        <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500'></span>
                      </span>
                      <span className='text-xs font-bold uppercase tracking-wider'>Active Hiring</span>
                    </span>
                  )}
                  {(jobData.hiringActivity || 'stale') === 'slow' && (
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-700 shadow-sm'>
                      <span className='h-2 w-2 rounded-full bg-amber-500'></span>
                      <span className='text-xs font-bold uppercase tracking-wider'>Slow Activity</span>
                    </span>
                  )}
                  {(jobData.hiringActivity || 'stale') === 'stale' && (
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-rose-700 shadow-sm'>
                      <span className='h-2 w-2 rounded-full bg-rose-500'></span>
                      <span className='text-xs font-bold uppercase tracking-wider'>Likely Stale</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className='text-center md:text-right'>
              <button onClick={applyHandler} className={`px-8 py-4 ${isAlreadyApplied ? 'rounded-xl bg-gray-200 font-extrabold text-gray-500' : 'premium-button cursor-pointer'}`}>
                {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
              </button>
              <p className='mt-3 text-sm font-semibold text-gray-500'>CTC: {kConvert.convertTo(jobData.salary)}</p>
            </div>
          </div>
        </section>

        <div className='grid gap-8 lg:grid-cols-[1fr_360px]'>
          <article className='premium-panel rounded-[1.5rem] p-6 md:p-8'>
            <h2 className='mb-5 text-2xl font-extrabold text-gray-950'>Job description</h2>
            <div className='rich-text prose max-w-none text-gray-700' dangerouslySetInnerHTML={{ __html: jobData.description }} />
            <button onClick={applyHandler} className={`mt-10 px-8 py-3.5 ${isAlreadyApplied ? 'rounded-xl bg-gray-200 font-extrabold text-gray-500' : 'premium-button cursor-pointer'}`}>
              {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
            </button>
          </article>

          <aside>
            <div className='sticky top-24'>
              <h2 className='mb-4 text-xl font-extrabold text-gray-950'>More jobs from {jobData.companyId.name}</h2>
              <div className='space-y-5'>
                {jobs.filter(job => job._id !== jobData._id && job.companyId._id === jobData.companyId._id).filter(job => {
                  const appliedJobsIds = new Set(userApplications.map(app => app.jobId && app.jobId._id))
                  return !appliedJobsIds.has(job._id)
                }).slice(0, 4).map((job, index) => <JobCard key={index} job={job} />)}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  ) : (
    <div className='flex min-h-screen items-center justify-center'>
      <Loader />
    </div>
  )
}

const Info = ({ icon, text }) => (
  <span className='inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5'>
    {React.cloneElement(icon, { size: 15, className: 'text-blue-600' })}
    {text}
  </span>
)

export default ApplyJob
