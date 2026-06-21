import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Building2, Mail, Shield, UploadCloud, X, Eye, EyeOff, User, Link2 } from 'lucide-react'

const RecruiterLogin = () => {
  const navigate = useNavigate()
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setemail] = useState('')
  const [image, setImage] = useState(false)
  const [recruiterName, setRecruiterName] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [isTextDataSubmitted, setIsDataSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { setShowRecruiterLogin, backendUrl, setcompanyData, setCompanyToken } = useContext(AppContext)

  const fillDemoCredentials = () => {
    setState('Login')
    setemail('slack@demo.com')
    setPassword('slackpassword')
    toast.success('Demo recruiter credentials pre-filled!')
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (state === 'Sign Up' && !isTextDataSubmitted) {
      if (!name || !email || !password || !recruiterName || !linkedin) {
        return toast.error("Please fill in all details.")
      }
      if (!linkedin.includes("linkedin.com")) {
        return toast.error("Please enter a valid LinkedIn profile URL.")
      }
      const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com'];
      const emailDomain = email.split('@')[1]?.toLowerCase();
      if (publicDomains.includes(emailDomain)) {
        return toast.error("Corporate work email is required to register a company profile.")
      }
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
        formData.append('recruiterName', recruiterName)
        formData.append('linkedin', linkedin)

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
      <div className='relative grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] md:grid-cols-[0.9fr_1.1fr]'>
        
        {/* Left Side Pane - Recruiter Benefits & Stats */}
        <div className='relative hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8 text-slate-950 md:flex md:flex-col md:justify-between'>
          <div className='absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl' />
          
          <div className='relative z-10'>
            <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]'>
              <Building2 size={24} />
            </div>
            <h2 className='text-3xl font-extrabold leading-tight'>Hire with a sharper command center.</h2>
            <p className='mt-3 text-sm leading-relaxed text-slate-600'>
              Post roles, review resumes, and move applicants through a clean professional pipeline.
            </p>
            
            {/* Features Checklists */}
            <div className='space-y-3.5 mt-8'>
              <div className='flex items-center gap-3 rounded-xl bg-white/80 p-3 border border-slate-200 hover:bg-white transition-colors'>
                <span className='flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-extrabold'>✓</span>
                <p className='text-xs text-slate-700 font-semibold'>Real-time Hiring Activity Tracker</p>
              </div>
              <div className='flex items-center gap-3 rounded-xl bg-white/80 p-3 border border-slate-200 hover:bg-white transition-colors'>
                <span className='flex h-5 w-5 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 text-xs font-extrabold'>✓</span>
                <p className='text-xs text-slate-700 font-semibold'>ATS Resume Parser Integration</p>
              </div>
              <div className='flex items-center gap-3 rounded-xl bg-white/80 p-3 border border-slate-200 hover:bg-white transition-colors'>
                <span className='flex h-5 w-5 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 text-xs font-extrabold'>✓</span>
                <p className='text-xs text-slate-700 font-semibold'>Instant Ghost-Job Prevention Shield</p>
              </div>
            </div>
          </div>

          <div className='relative z-10 rounded-2xl border border-slate-200 bg-white/82 p-4 mt-6'>
            <p className='text-xs font-bold uppercase tracking-[0.16em] text-blue-600'>Enterprise-grade Suite</p>
            <p className='mt-2 text-xs text-slate-600 leading-relaxed'>
              Structured listings, verified company profiles, and faster candidate decisions all in one place.
            </p>
          </div>
        </div>

        {/* Right Side Pane - Form */}
        <div className='relative flex flex-col justify-center bg-white p-7 sm:p-9'>
          <button
            onClick={() => setShowRecruiterLogin(false)}
            className='absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900'
            aria-label='Close recruiter login'
          >
            <X size={18} />
          </button>

          <form onSubmit={onSubmitHandler} className='w-full'>
            <div className='mb-6 pr-8'>
              <p className='section-kicker mb-2.5'>Recruiter {state}</p>
              <h1 className='text-3xl font-extrabold text-gray-950 tracking-tight'>
                {state === 'Login' ? 'Welcome back.' : 'Create your workspace.'}
              </h1>
              <p className='mt-1 text-sm text-gray-500'>
                {state === 'Login' ? 'Sign in to manage postings and applications.' : 'Set up your company profile to start hiring.'}
              </p>
            </div>

            {/* Quick Demo Fill Card */}
            {state === 'Login' && (
              <div className='mb-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 transition-all hover:bg-blue-50/80'>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-xs font-bold text-blue-700 uppercase tracking-wider'>Demo Account Available</p>
                    <p className='text-[11px] text-gray-500 mt-0.5 leading-relaxed'>Skip registering and test the workspace immediately.</p>
                  </div>
                  <button
                    type='button'
                    onClick={fillDemoCredentials}
                    className='cursor-pointer text-nowrap rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-extrabold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-sm'
                  >
                    Quick Fill
                  </button>
                </div>
              </div>
            )}

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
              <div className='space-y-3.5'>
                {state !== 'Login' && (
                  <>
                    <Field icon={<Building2 />} value={name} onChange={setName} type='text' placeholder='Company Name' />
                    <Field icon={<User />} value={recruiterName} onChange={setRecruiterName} type='text' placeholder='Your Full Name (Recruiter)' />
                    <Field icon={<Link2 />} value={linkedin} onChange={setLinkedin} type='text' placeholder='LinkedIn Profile URL' />
                  </>
                )}
                <Field icon={<Mail />} value={email} onChange={setemail} type='email' placeholder='Email Address' />
                
                {/* Password field with Show/Hide toggle */}
                <Field
                  icon={<Shield />}
                  value={password}
                  onChange={setPassword}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  rightElement={
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='text-gray-400 hover:text-gray-600 focus:outline-none transition-colors'
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
              </div>
            )}

            {state === 'Login' && (
              <div className='mt-3.5 text-right'>
                <p className='inline-block cursor-pointer text-xs font-extrabold text-blue-600 hover:underline'>Forgot password?</p>
              </div>
            )}

            <button type='submit' className='premium-button mt-5 w-full cursor-pointer py-3.5 shadow-sm'>
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

const Field = ({ icon, value, onChange, type, placeholder, rightElement }) => (
  <div className='premium-input flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'>
    <div className='flex flex-1 items-center gap-3'>
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
    {rightElement}
  </div>
)

export default RecruiterLogin
