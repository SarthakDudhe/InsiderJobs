import React, { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { Send } from 'lucide-react'

const AddJob = () => {
  const [title, settitle] = useState('')
  const [location, setlocation] = useState('Mumbai')
  const [category, setCategory] = useState('Programming')
  const [level, setLevel] = useState('Beginner Level')
  const [salary, setSalary] = useState(0)

  const editorRef = useRef(null)
  const quilRef = useRef(null)
  const { backendUrl, companyToken } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const description = quilRef.current.root.innerHTML
      const { data } = await axios.post(
        backendUrl + '/api/company/post-job',
        { title, description, location, salary, category, level },
        { headers: { token: companyToken } }
      )

      if (data.success) {
        toast.success(data.message)
        settitle('')
        setSalary(0)
        quilRef.current.root.innerHTML = ''
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!quilRef.current && editorRef.current) {
      quilRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  return (
    <div className='mx-auto max-w-5xl'>
      <div className='mb-6'>
        <p className='section-kicker'>Create listing</p>
        <h1 className='mt-2 text-3xl font-extrabold text-gray-950'>Post a new job</h1>
        <p className='mt-2 text-gray-600'>Craft a polished role that attracts qualified candidates.</p>
      </div>

      <form onSubmit={onSubmitHandler} className='premium-panel overflow-hidden rounded-[1.5rem]'>
        <div className='border-b border-gray-200 bg-gray-950 px-6 py-7 text-white sm:px-8'>
          <h2 className='text-2xl font-extrabold'>Role details</h2>
          <p className='mt-1 text-sm text-gray-300'>Keep the title clear and the description outcome-focused.</p>
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

        <div className='flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-5 sm:px-8'>
          <button className='premium-button cursor-pointer px-8 py-3.5'>
            Post Job <Send size={17} />
          </button>
        </div>
      </form>
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
