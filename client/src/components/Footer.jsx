import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='container px-4 2xl:px-20 mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 py-6 mt-10 sm:mt-20 border-t border-gray-100'>
      <img width={140} src={assets.logo} alt="" className='max-sm:mx-auto' />
      <p className='flex-1 border-l-0 sm:border-l border-gray-300 sm:pl-4 text-[13px] text-gray-500 text-center sm:text-left'>
        Copyright @SarthakDudhe | All rights reserved.
      </p>
      <div className='flex flex-row gap-3'>
        <img width={32} className='cursor-pointer hover:opacity-80 transition-opacity' src={assets.facebook_icon} alt="" />
        <img width={32} className='cursor-pointer hover:opacity-80 transition-opacity' src={assets.twitter_icon} alt="" />
        <img width={32} className='cursor-pointer hover:opacity-80 transition-opacity' src={assets.instagram_icon} alt="" />
      </div>
    </div>
  )
}

export default Footer