import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Activity, BrainCircuit, CheckCircle2, Eye, EyeOff, Loader2, Mail, Shield, Sparkles, Target, User, X } from 'lucide-react'

const UserLogin = () => {
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setemail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { setShowUserLogin, backendUrl, setUserData, setUserToken } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      if (state === 'Login') {
        const { data } = await axios.post(backendUrl + '/api/users/login', { email, password })
        if (data.success) {
          setUserData(data.user)
          setUserToken(data.token)
          localStorage.setItem('userToken', data.token)
          setShowUserLogin(false)
          toast.success(`Welcome back, ${data.user.name}.`)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/users/register', { name, email, password })
        if (data.success) {
          setUserData(data.user)
          setUserToken(data.token)
          localStorage.setItem('userToken', data.token)
          setShowUserLogin(false)
          toast.success(`Account created. Welcome, ${data.user.name}.`)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsSubmitting(false)
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
              <Target size={24} />
            </div>
            <p className='section-kicker'>Candidate workspace</p>
            <h2 className='mt-3 text-3xl font-semibold leading-tight tracking-tight'>
              Keep every opportunity, resume signal, and next step in view.
            </h2>
            <p className='mt-4 text-sm leading-7 text-slate-600'>
              Save roles, apply with a verified profile, track outcomes, and use resume match tools before you spend time on a posting.
            </p>

            <div className='mt-8 grid gap-3'>
              <CandidateSignal icon={<BrainCircuit />} title='Resume match guidance' description='Compare your resume against role requirements before applying.' />
              <CandidateSignal icon={<Activity />} title='Application pipeline' description='Track pending, accepted, and rejected applications in one place.' />
              <CandidateSignal icon={<Sparkles />} title='Personalized discovery' description='Use profile signals to focus on stronger-match roles.' />
            </div>
          </div>

          <div className='mt-6 grid grid-cols-3 gap-2'>
            <TrustMetric value='Verified' label='roles' />
            <TrustMetric value='ATS' label='resume tools' />
            <TrustMetric value='Live' label='tracking' />
          </div>
        </div>

        <div className='relative flex flex-col justify-center bg-white p-7 sm:p-9'>
          <button
            onClick={() => setShowUserLogin(false)}
            className='absolute right-5 top-5 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900'
            aria-label='Close login'
          >
            <X size={18} />
          </button>

          <form onSubmit={onSubmitHandler} className='w-full'>
            <div className='mb-6 pr-8'>
              <p className='section-kicker mb-2.5'>Candidate {state}</p>
              <h1 className='text-3xl font-semibold tracking-tight text-slate-950'>
                {state === 'Login' ? 'Welcome back to your search.' : 'Create your candidate profile.'}
              </h1>
              <p className='mt-2 text-sm leading-6 text-slate-500'>
                {state === 'Login' ? 'Sign in to review saved roles, applications, and resume match tools.' : 'Set up your profile so you can apply and track every opportunity clearly.'}
              </p>
            </div>

            <div className='space-y-3.5'>
              {state !== 'Login' && (
                <Field icon={<User />} value={name} onChange={setName} type='text' placeholder='Full name' />
              )}
              <Field icon={<Mail />} value={email} onChange={setemail} type='email' placeholder='Email address' />
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

            <button type='submit' disabled={isSubmitting} className='premium-button mt-6 w-full cursor-pointer py-3.5 shadow-sm disabled:cursor-not-allowed disabled:opacity-70'>
              {isSubmitting ? (
                <>
                  {state === 'Login' ? 'Signing in' : 'Creating profile'} <Loader2 size={17} className='animate-spin' />
                </>
              ) : (
                state === 'Login' ? 'Open candidate workspace' : 'Create profile'
              )}
            </button>

            <div className='pt-5 text-center'>
              {state === 'Login' ? (
                <p className='text-sm font-medium text-slate-500'>
                  Do not have an account?{' '}
                  <span onClick={() => setState('Sign Up')} className='cursor-pointer font-extrabold text-blue-600 hover:underline'>
                    Create profile
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

const CandidateSignal = ({ icon, title, description }) => (
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

export default UserLogin
