import React, { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { BriefcaseBusiness, Loader2, MapPin, Send, Sparkles } from 'lucide-react'
import { writeRecruiterCache } from '../utils/recruiterCache'

const AddJob = () => {
  const [title, settitle] = useState('')
  const [location, setlocation] = useState('Mumbai')
  const [category, setCategory] = useState('Programming')
  const [level, setLevel] = useState('Beginner Level')
  const [salary, setSalary] = useState(0)
  const [isPosting, setIsPosting] = useState(false)

  const editorRef = useRef(null)
  const quilRef = useRef(null)
  const { backendUrl, companyToken } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isPosting) return
    setIsPosting(true)
    try {
      const description = quilRef.current.root.innerHTML
      const { data } = await axios.post(
        backendUrl + '/api/company/post-job',
        { title, description, location, salary, category, level },
        { headers: { token: companyToken } }
      )

      if (data.success) {
        toast.success(data.message)
        await refreshRecruiterJobsCache()
        settitle('')
        setSalary(0)
        quilRef.current.root.innerHTML = ''
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsPosting(false)
    }
  }

  const refreshRecruiterJobsCache = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/company/list-jobs', {
        headers: { token: companyToken }
      })
      if (data.success) {
        writeRecruiterCache(companyToken, { jobs: [...(data.jobsData || [])].reverse() })
      }
    } catch {
      // The manage page will revalidate if this cache refresh misses.
    }
  }

  useEffect(() => {
    if (!quilRef.current && editorRef.current) {
      quilRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  return (
    <div className='mx-auto max-w-5xl'>
      <div className='mb-6 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end'>
        <div>
          <p className='section-kicker'>Create listing</p>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl'>Build a candidate-ready role brief.</h1>
          <p className='mt-3 max-w-2xl text-sm leading-7 text-slate-600'>Write the opening once, then publish it into a recruiter workspace that keeps visibility and applicant decisions organized.</p>
        </div>
        <div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-1'>
          <DraftSignal icon={<BriefcaseBusiness />} label='Role' value={title || 'Untitled'} />
          <DraftSignal icon={<MapPin />} label='Location' value={location} tone='emerald' />
          <DraftSignal icon={<Sparkles />} label='Level' value={level.replace(' Level', '')} tone='violet' />
        </div>
      </div>

      <form onSubmit={onSubmitHandler} className='premium-panel overflow-hidden rounded-[1.5rem]'>
        <div className='border-b border-slate-200 bg-gradient-to-br from-white via-blue-50/70 to-cyan-50/40 px-6 py-7 text-slate-950 sm:px-8'>
          <h2 className='text-2xl font-semibold tracking-tight'>Role intelligence</h2>
          <p className='mt-1 text-sm leading-6 text-slate-600'>Keep the title searchable, the description outcome-focused, and the salary clear enough for qualified candidates to act.</p>
        </div>

        <div className='space-y-8 p-6 sm:p-8'>
          <div>
            <label className='mb-2 block text-sm font-extrabold text-gray-700'>Job Title</label>
            <input
              className='premium-input w-full rounded-2xl px-4 py-3.5'
              type='text'
              placeholder='e.g. Senior Full Stack Developer'
              onChange={e => settitle(e.target.value)}
              value={title}
              required
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-extrabold text-gray-700'>Job Description</label>
            <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white'>
              <div ref={editorRef} className='min-h-[250px] bg-white' />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
            <SelectField label='Category' value={category} onChange={setCategory} options={JobCategories} />
            <SelectField label='Location' value={location} onChange={setlocation} options={JobLocations} />
            <SelectField label='Level' value={level} onChange={setLevel} options={['Beginner Level', 'Intermediate Level', 'Senior Level']} />
          </div>

          <div className='w-full md:w-1/3'>
            <label className='mb-2 block text-sm font-extrabold text-gray-700'>Monthly Salary</label>
            <input
              min={0}
              className='premium-input w-full rounded-2xl px-4 py-3.5'
              type='number'
              placeholder='50000'
              onChange={e => setSalary(e.target.value)}
              value={salary}
            />
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-slate-50 px-6 py-5 sm:px-8'>
          <p className='text-xs font-semibold text-slate-500'>Listings remain hidden until your workspace is approved.</p>
          <button disabled={isPosting} className='premium-button cursor-pointer px-8 py-3.5 disabled:cursor-not-allowed disabled:opacity-70'>
            {isPosting ? (
              <>
                Posting <Loader2 size={17} className='animate-spin' />
              </>
            ) : (
              <>
                Post job <Send size={17} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

const DraftSignal = ({ icon, label, value, tone = 'blue' }) => {
  const styles = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    violet: 'border-violet-100 bg-violet-50 text-violet-700'
  }[tone]

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${styles}`}>
      <div className='mb-2 flex items-center justify-between gap-3'>
        {React.cloneElement(icon, { size: 17 })}
        <span className='truncate text-sm font-semibold'>{value}</span>
      </div>
      <p className='text-[10px] font-bold uppercase tracking-[0.14em]'>{label}</p>
    </div>
  )
}

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className='mb-2 block text-sm font-extrabold text-gray-700'>{label}</label>
    <select
      className='premium-input w-full cursor-pointer rounded-2xl px-4 py-3.5'
      onChange={e => onChange(e.target.value)}
      value={value}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </select>
  </div>
)

export default AddJob
