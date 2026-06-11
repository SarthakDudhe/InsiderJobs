import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Building2, Mail, Shield, UploadCloud, X } from 'lucide-react'

const RecruiterLogin = () => {
  const navigate = useNavigate()
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setemail] = useState('')
  const [image, setImage] = useState(false)
  const [isTextDataSubmitted, setIsDataSubmitted] = useState(false)
  const { setShowRecruiterLogin, backendUrl, setcompanyData, setCompanyToken } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (state === 'Sign Up' && !isTextDataSubmitted) {
      return setIsDataSubmitted(true)
    }
    try {
      if (state === 'Login') {
        const { data } = await axios.post(backendUrl + '/api/company/login', { email, password })
        if (data.success) {
          setcompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem('companyToken', data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')
        } else {
          toast.error(data.message)
        }
      } else {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('password', password)
        formData.append('email', email)
        formData.append('image', image)

        const { data } = await axios.post(backendUrl + '/api/company/register', formData)
        if (data.success) {
          setcompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem('companyToken', data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-md'>
      <div className='relative grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl md:grid-cols-[0.9fr_1.1fr]'>
        <div className='relative hidden bg-gray-950 p-8 text-white md:block'>
          <div className='absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl' />
          <div className='relative z-10 flex h-full flex-col justify-between'>
            <div>
              <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600'>
                <Building2 size={24} />
              </div>
              <h2 className='text-3xl font-extrabold leading-tight'>Hire with a sharper command center.</h2>
              <p className='mt-4 text-sm leading-relaxed text-gray-300'>Post roles, review resumes, and move applicants through a clean professional pipeline.</p>
            </div>
            <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
              <p className='text-xs font-bold uppercase tracking-[0.16em] text-blue-200'>Recruiter-grade</p>
              <p className='mt-2 text-sm text-gray-300'>Structured listings, verified company profiles, and faster candidate decisions.</p>
            </div>
          </div>
        </div>

        <div className='relative'>
          <button
            onClick={() => setShowRecruiterLogin(false)}
            className='absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900'
            aria-label='Close recruiter login'
          >
            <X size={18} />
          </button>

          <form onSubmit={onSubmitHandler} className='p-7 sm:p-9'>
            <div className='mb-8 pr-10'>
              <p className='section-kicker mb-2'>Recruiter {state}</p>
              <h1 className='text-3xl font-extrabold text-gray-950'>
                {state === 'Login' ? 'Welcome back.' : 'Create your hiring workspace.'}
              </h1>
              <p className='mt-2 text-sm text-gray-500'>
                {state === 'Login' ? 'Sign in to manage postings and applications.' : 'Set up your company profile to start hiring.'}
              </p>
            </div>

            {state === 'Sign Up' && isTextDataSubmitted ? (
              <div className='flex flex-col items-center gap-4 py-4'>
                <label htmlFor='image' className='cursor-pointer'>
                  <div className='flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-500'>
                    {image ? <img className='h-full w-full object-cover' src={URL.createObjectURL(image)} alt='Preview' /> : <UploadCloud className='text-gray-400' size={30} />}
                  </div>
                  <input onChange={e => setImage(e.target.files[0])} type='file' id='image' hidden />
                </label>
                <p className='text-sm font-extrabold text-gray-600'>Upload Company Logo</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {state !== 'Login' && (
                  <Field icon={<Building2 />} value={name} onChange={setName} type='text' placeholder='Company Name' />
                )}
                <Field icon={<Mail />} value={email} onChange={setemail} type='email' placeholder='Email Address' />
                <Field icon={<Shield />} value={password} onChange={setPassword} type='password' placeholder='Password' />
              </div>
            )}

            {state === 'Login' && (
              <div className='mt-4 text-right'>
                <p className='inline-block cursor-pointer text-xs font-extrabold text-blue-600 hover:underline'>Forgot password?</p>
              </div>
            )}

            <button type='submit' className='premium-button mt-6 w-full cursor-pointer py-3.5'>
              {state === 'Login' ? 'Login' : isTextDataSubmitted ? 'Create Account' : 'Next'}
            </button>

            <div className='pt-5 text-center'>
              {state === 'Login' ? (
                <p className='text-sm font-medium text-gray-500'>
                  Don't have an account?{' '}
                  <span onClick={() => setState('Sign Up')} className='cursor-pointer font-extrabold text-blue-600 hover:underline'>
                    Sign Up
                  </span>
                </p>
              ) : (
                <p className='text-sm font-medium text-gray-500'>
                  Already have an account?{' '}
                  <span onClick={() => setState('Login')} className='cursor-pointer font-extrabold text-blue-600 hover:underline'>
                    Login
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const Field = ({ icon, value, onChange, type, placeholder }) => (
  <div className='premium-input flex items-center gap-3 rounded-2xl px-4 py-3.5'>
    {React.cloneElement(icon, { size: 17, className: 'text-gray-400' })}
    <input
      className='w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400'
      onChange={e => onChange(e.target.value)}
      value={value}
      type={type}
      placeholder={placeholder}
      required
    />
  </div>
)

export default RecruiterLogin
