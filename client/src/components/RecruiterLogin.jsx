import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
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

    if (state == "Sign Up" && !isTextDataSubmitted) {
      return setIsDataSubmitted(true)
    }
    try {
      if (state === "Login") {


        const { data } = await axios.post(backendUrl + '/api/company/login', { email, password })
        if (data.success) {
          setcompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem("companyToken", data.token)
          setShowRecruiterLogin(false)
          navigate("/dashboard")
        }
        else {
          toast.error(data.message)
        }
      }
      else {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('password', password)
        formData.append('email', email)
        formData.append('image', image)


        const { data } = await axios.post(backendUrl + '/api/company/register', formData)

        if (data.success) {

          setcompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem("companyToken", data.token)
          setShowRecruiterLogin(false)
          navigate("/dashboard")
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }


  }

  useEffect(() => {

    document.body.style.overflow = "hidden"
    return () => {

      document.body.style.overflow = "unset"
    }
  }, [])




  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40'>
      <div className='relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100'>
        {/* Header Section */}
        <div className='bg-blue-600 px-8 py-8 text-white text-center relative'>
          <img
            src={assets.cross_icon}
            onClick={() => setShowRecruiterLogin(false)}
            className='absolute top-6 right-6 w-4 h-4 cursor-pointer opacity-70 hover:opacity-100 transition-opacity invert'
            alt="Close"
          />
          <h1 className='text-2xl font-bold'>Recruiter {state}</h1>
          <p className='text-blue-100 mt-1 text-sm font-medium'>
            {state === 'Login' ? 'Sign in to manage your postings' : 'Create an account to start hiring'}
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={onSubmitHandler} className='p-8 space-y-5'>
          {state === "Sign Up" && isTextDataSubmitted ? (
            <div className='flex flex-col items-center gap-4 py-2'>
              <div className='relative group'>
                <label htmlFor="image" className='cursor-pointer'>
                  <div className='w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:border-blue-500 transition-all'>
                    {image ? (
                      <img className='w-full h-full object-cover' src={URL.createObjectURL(image)} alt="Preview" />
                    ) : (
                      <img src={assets.upload_area} className='w-8 opacity-40' alt="" />
                    )}
                  </div>
                  <input onChange={e => setImage(e.target.files[0])} type="file" id="image" hidden />
                </label>
              </div>
              <p className='text-sm text-gray-500 font-bold'>Upload Company Logo</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {state !== "Login" && (
                <div className='border px-4 py-3 flex items-center gap-3 rounded-xl bg-gray-50 border-gray-100 focus-within:border-blue-500 focus-within:bg-white transition-all'>
                  <img src={assets.person_icon} className='w-4 opacity-50' alt="" />
                  <input
                    className='outline-none text-sm w-full bg-transparent text-gray-700 font-medium'
                    onChange={e => setName(e.target.value)}
                    value={name}
                    type="text"
                    placeholder='Company Name'
                    required
                  />
                </div>
              )}

              <div className='border px-4 py-3 flex items-center gap-3 rounded-xl bg-gray-50 border-gray-100 focus-within:border-blue-500 focus-within:bg-white transition-all'>
                <img src={assets.email_icon} className='w-4 opacity-50' alt="" />
                <input
                  className='outline-none text-sm w-full bg-transparent text-gray-700 font-medium'
                  onChange={e => setemail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder='Email Address'
                  required
                />
              </div>

              <div className='border px-4 py-3 flex items-center gap-3 rounded-xl bg-gray-50 border-gray-100 focus-within:border-blue-500 focus-within:bg-white transition-all'>
                <img src={assets.lock_icon} className='w-4 opacity-50' alt="" />
                <input
                  className='outline-none text-sm w-full bg-transparent text-gray-700 font-medium'
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder='Password'
                  required
                />
              </div>
            </div>
          )}

          {state === "Login" && (
            <div className='text-right'>
              <p className='text-xs text-blue-600 hover:underline cursor-pointer font-bold inline-block'>Forgot password?</p>
            </div>
          )}

          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] cursor-pointer'
          >
            {state === 'Login' ? 'Login' : isTextDataSubmitted ? 'Create Account' : 'Next'}
          </button>

          <div className='text-center pt-2'>
            {state === "Login" ? (
              <p className='text-sm text-gray-500 font-medium'>
                Don't have an account?{' '}
                <span onClick={() => setState("Sign Up")} className='text-blue-600 font-bold cursor-pointer hover:underline'>
                  Sign Up
                </span>
              </p>
            ) : (
              <p className='text-sm text-gray-500 font-medium'>
                Already have an account?{' '}
                <span onClick={() => setState("Login")} className='text-blue-600 font-bold cursor-pointer hover:underline'>
                  Login
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecruiterLogin