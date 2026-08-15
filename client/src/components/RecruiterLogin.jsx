import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Eye,
  EyeOff,
  Link2,
  Mail,
  Shield,
  UploadCloud,
  User,
  UsersRound,
  X
} from 'lucide-react'

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
    toast.success('Demo recruiter credentials pre-filled.')
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (state === 'Sign Up' && !isTextDataSubmitted) {
      if (!name || !email || !password || !recruiterName || !linkedin) {
        return toast.error('Please fill in all details.')
      }
      if (!linkedin.includes('linkedin.com')) {
        return toast.error('Please enter a valid LinkedIn profile URL.')
      }
      const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com']
      const emailDomain = email.split('@')[1]?.toLowerCase()
      if (publicDomains.includes(emailDomain)) {
        return toast.error('Corporate work email is required to register a company profile.')
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
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md'>
      <div className='relative grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] md:grid-cols-[0.95fr_1.05fr]'>
        <div className='hidden border-r border-slate-200 bg-gradient-to-br from-white via-blue-50/70 to-cyan-50/40 p-8 text-slate-950 md:flex md:flex-col md:justify-between'>
          <div>
            <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-700 shadow-sm'>
              <Building2 size={24} />
            </div>
            <p className='section-kicker'>Recruiter workspace</p>
            <h2 className='mt-3 text-3xl font-semibold leading-tight tracking-tight'>
              Run hiring from a verified operating console.
            </h2>
            <p className='mt-4 text-sm leading-7 text-slate-600'>
              Publish roles, review candidate resumes, and keep every applicant decision visible from one professional workspace.
            </p>

            <div className='mt-8 grid gap-3'>
              <RecruiterSignal icon={<ClipboardList />} title='Structured postings' description='Create candidate-ready listings with clear role context.' />
              <RecruiterSignal icon={<UsersRound />} title='Candidate pipeline' description='Review resumes, links, status, and match signals quickly.' />
              <RecruiterSignal icon={<Shield />} title='Verified workspace' description='Work email and company review keep listings accountable.' />
            </div>
          </div>

          <div className='mt-6 grid grid-cols-3 gap-2'>
            <TrustMetric value='Live' label='posting tools' />
            <TrustMetric value='AI' label='resume review' />
            <TrustMetric value='Verified' label='workspace' />
          </div>
        </div>

        <div className='relative flex flex-col justify-center bg-white p-7 sm:p-9'>
          <button
            onClick={() => setShowRecruiterLogin(false)}
            className='absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900'
            aria-label='Close recruiter login'
          >
            <X size={18} />
          </button>

          <form onSubmit={onSubmitHandler} className='w-full'>
            <div className='mb-6 pr-8'>
              <p className='section-kicker mb-2.5'>Recruiter {state}</p>
              <h1 className='text-3xl font-semibold tracking-tight text-slate-950'>
                {state === 'Login' ? 'Welcome back to hiring ops.' : 'Create a verified workspace.'}
              </h1>
              <p className='mt-2 text-sm leading-6 text-slate-500'>
                {state === 'Login' ? 'Sign in to manage postings, candidates, and application decisions.' : 'Set up your company profile so candidates see a trusted hiring team.'}
              </p>
            </div>

            {state === 'Login' && (
              <div className='mb-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 transition-all hover:bg-blue-50'>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-xs font-bold uppercase tracking-[0.14em] text-blue-700'>Demo workspace</p>
                    <p className='mt-0.5 text-[11px] leading-relaxed text-slate-500'>Skip registering and test the workspace immediately.</p>
                  </div>
                  <button
                    type='button'
                    onClick={fillDemoCredentials}
                    className='cursor-pointer text-nowrap rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95'
                  >
                    Quick fill
                  </button>
                </div>
              </div>
            )}

            {state === 'Sign Up' && isTextDataSubmitted ? (
              <div className='flex flex-col items-center gap-4 py-4'>
                <label htmlFor='image' className='cursor-pointer'>
                  <div className='flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/70 transition-all hover:border-blue-500'>
                    {image ? <img className='h-full w-full object-cover' src={URL.createObjectURL(image)} alt='Preview' /> : <UploadCloud className='text-slate-400' size={30} />}
                  </div>
                  <input onChange={e => setImage(e.target.files[0])} type='file' id='image' hidden />
                </label>
                <div className='text-center'>
                  <p className='text-sm font-extrabold text-slate-700'>Upload company logo</p>
                  <p className='mt-1 max-w-xs text-xs leading-5 text-slate-500'>This appears on candidate-facing listings and company signal cards.</p>
                </div>
              </div>
            ) : (
              <div className='space-y-3.5'>
                {state !== 'Login' && (
                  <>
                    <Field icon={<Building2 />} value={name} onChange={setName} type='text' placeholder='Company name' />
                    <Field icon={<User />} value={recruiterName} onChange={setRecruiterName} type='text' placeholder='Recruiter full name' />
                    <Field icon={<Link2 />} value={linkedin} onChange={setLinkedin} type='text' placeholder='LinkedIn profile URL' />
                  </>
                )}
                <Field icon={<Mail />} value={email} onChange={setemail} type='email' placeholder='Work email address' />
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
                      className='text-slate-400 transition-colors hover:text-slate-600 focus:outline-none'
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
              {state === 'Login' ? 'Open recruiter console' : isTextDataSubmitted ? 'Create workspace' : 'Continue setup'}
            </button>

            <div className='pt-5 text-center'>
              {state === 'Login' ? (
                <p className='text-sm font-medium text-slate-500'>
                  Do not have an account?{' '}
                  <span onClick={() => setState('Sign Up')} className='cursor-pointer font-extrabold text-blue-600 hover:underline'>
                    Create workspace
                  </span>
                </p>
              ) : (
                <p className='text-sm font-medium text-slate-500'>
                  Already have an account?{' '}
                  <span onClick={() => setState('Login')} className='cursor-pointer font-extrabold text-blue-600 hover:underline'>
                    Sign in
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

const RecruiterSignal = ({ icon, title, description }) => (
  <div className='flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/85 p-3 shadow-sm'>
    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700'>
      {React.cloneElement(icon, { size: 17 })}
    </div>
    <div>
      <p className='text-sm font-bold text-slate-950'>{title}</p>
      <p className='mt-0.5 text-xs leading-5 text-slate-500'>{description}</p>
    </div>
  </div>
)

const TrustMetric = ({ value, label }) => (
  <div className='rounded-2xl border border-slate-200 bg-white/85 p-3 shadow-sm'>
    <div className='mb-2 flex items-center gap-1.5 text-blue-700'>
      <CheckCircle2 size={14} />
      <span className='text-sm font-bold'>{value}</span>
    </div>
    <p className='text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400'>{label}</p>
  </div>
)

const Field = ({ icon, value, onChange, type, placeholder, rightElement }) => (
  <div className='premium-input flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'>
    <div className='flex flex-1 items-center gap-3'>
      {React.cloneElement(icon, { size: 17, className: 'text-slate-400' })}
      <input
        className='w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400'
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
