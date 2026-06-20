import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { User, Mail, Shield, X, Eye, EyeOff, Sparkles, BrainCircuit, Activity } from 'lucide-react'

const UserLogin = () => {
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setemail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const { setShowUserLogin, backendUrl, setUserData, setUserToken } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      if (state === 'Login') {
        const { data } = await axios.post(backendUrl + '/api/users/login', { email, password })
        if (data.success) {
          setUserData(data.user)
          setUserToken(data.token)
          localStorage.setItem('userToken', data.token)
          setShowUserLogin(false)
          toast.success(`Welcome back, ${data.user.name}!`)
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
          toast.success(`Account created successfully! Welcome, ${data.user.name}.`)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
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
        
        {/* Left Side Pane - Candidate Insights */}
        <div className='relative hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8 text-slate-950 md:flex md:flex-col md:justify-between'>
          <div className='absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl' />
          
          <div className='relative z-10'>
            <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'>
              <Sparkles size={24} />
            </div>
            <h2 className='text-3xl font-extrabold leading-tight'>Unlock your career command center.</h2>
            <p className='mt-3 text-sm leading-relaxed text-slate-600'>
              Apply for roles, get tailored AI resume insights, and track your active hiring pipeline.
            </p>
            
            {/* Features Checklists */}
            <div className='space-y-3.5 mt-8'>
              <div className='flex items-center gap-3 rounded-xl bg-white/80 p-3 border border-slate-200 hover:bg-white transition-colors'>
                <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600'>
                  <BrainCircuit size={16} />
                </span>
                <p className='text-xs text-slate-700 font-semibold'>Tailored AI Job Recommendations</p>
              </div>
              <div className='flex items-center gap-3 rounded-xl bg-white/80 p-3 border border-slate-200 hover:bg-white transition-colors'>
                <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600'>
                  <Activity size={16} />
                </span>
                <p className='text-xs text-slate-700 font-semibold'>Real-time Application Status Tracker</p>
              </div>
              <div className='flex items-center gap-3 rounded-xl bg-white/80 p-3 border border-slate-200 hover:bg-white transition-colors'>
                <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600'>
                  <Sparkles size={16} />
                </span>
                <p className='text-xs text-slate-700 font-semibold'>Instant Smart PDF Resume Parser</p>
              </div>
            </div>
          </div>

          <div className='relative z-10 rounded-2xl border border-slate-200 bg-white/82 p-4 mt-6'>
            <p className='text-xs font-bold uppercase tracking-[0.16em] text-blue-600'>Join thousands of professionals</p>
            <p className='mt-2 text-xs text-slate-600 leading-relaxed'>
              Get seen by top recruiters and match your specific technical skills directly to high-impact opportunities.
            </p>
          </div>
        </div>

        {/* Right Side Pane - Form */}
        <div className='relative flex flex-col justify-center bg-white p-7 sm:p-9'>
          <button
            onClick={() => setShowUserLogin(false)}
            className='absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 cursor-pointer'
            aria-label='Close login'
          >
            <X size={18} />
          </button>

          <form onSubmit={onSubmitHandler} className='w-full'>
            <div className='mb-6 pr-8'>
              <p className='section-kicker mb-2.5'>Candidate {state}</p>
              <h1 className='text-3xl font-extrabold text-gray-950 tracking-tight'>
                {state === 'Login' ? 'Welcome back.' : 'Create your profile.'}
              </h1>
              <p className='mt-1 text-sm text-gray-500'>
                {state === 'Login' ? 'Sign in to browse and apply for jobs.' : 'Set up your candidate account to start matching.'}
              </p>
            </div>

            <div className='space-y-3.5'>
              {state !== 'Login' && (
                <Field icon={<User />} value={name} onChange={setName} type='text' placeholder='Full Name' />
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

            <button type='submit' className='premium-button mt-6 w-full cursor-pointer py-3.5 shadow-sm'>
              {state === 'Login' ? 'Login' : 'Create Account'}
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

export default UserLogin
