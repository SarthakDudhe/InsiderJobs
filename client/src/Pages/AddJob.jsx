import React, { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from "react-toastify";

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

      const { data } = await axios.post(backendUrl + "/api/company/post-job",
        { title, description, location, salary, category, level },
        { headers: { token: companyToken } }
      )

      if (data.success) {
        console.log(data)
        toast.success(data.message)
        settitle('')
        setSalary(0)
        quilRef.current.root.innerHTML = ""
      }
      else {
        toast.error(data.message)
      }


    } catch (error) {
      toast.error(error.message)
    }
  }



  useEffect(() => {
    //Initiate Quill only Once
    if (!quilRef.current && editorRef.current) {
      quilRef.current = new Quill(editorRef.current, {
        theme: "snow"
      })
    }

  }, [])

  return (
    <div className='container mx-auto p-4 sm:p-6 max-w-4xl'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='bg-blue-600 px-6 py-8 text-white'>
          <h2 className='text-2xl font-bold'>Post a New Job</h2>
          <p className='text-blue-100 mt-1'>Fill in the details to reach thousands of talented candidates.</p>
        </div>

        <form onSubmit={onSubmitHandler} className='p-6 sm:p-8 space-y-8'>
          <div className='grid grid-cols-1 gap-8'>
            {/* Job Title */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Job Title</label>
              <input
                className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900'
                type="text"
                placeholder='e.g. Senior Full Stack Developer'
                onChange={e => settitle(e.target.value)}
                value={title}
                required
              />
            </div>

            {/* Job Description */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Job Description</label>
              <div className='rounded-xl border border-gray-200 overflow-hidden bg-gray-50'>
                <div ref={editorRef} className='min-h-[250px] bg-white'></div>
              </div>
            </div>

            {/* Grid for Selects */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Category</label>
                <select
                  className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none cursor-pointer text-gray-700'
                  onChange={e => setCategory(e.target.value)}
                  value={category}
                >
                  {JobCategories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Location</label>
                <select
                  className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none cursor-pointer text-gray-700'
                  onChange={e => setlocation(e.target.value)}
                  value={location}
                >
                  {JobLocations.map((loc, index) => (
                    <option key={index} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Level</label>
                <select
                  className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none cursor-pointer text-gray-700'
                  onChange={e => setLevel(e.target.value)}
                  value={level}
                >
                  <option value="Beginner Level">Beginner Level</option>
                  <option value="Intermediate Level">Intermediate Level</option>
                  <option value="Senior Level">Senior Level</option>
                </select>
              </div>
            </div>

            {/* Salary */}
            <div className='w-full md:w-1/3'>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Monthly Salary (₹)</label>
              <div className='relative'>
                <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium'>₹</span>
                <input
                  min={0}
                  className='w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-900'
                  type="number"
                  placeholder='50000'
                  onChange={e => setSalary(e.target.value)}
                  value={salary}
                />
              </div>
            </div>
          </div>

          <div className='pt-6 border-t border-gray-100 flex justify-end'>
            <button
              className='px-10 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer'
            >
              Post Job Now
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddJob