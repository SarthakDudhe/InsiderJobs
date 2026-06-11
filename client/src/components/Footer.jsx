import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='border-t border-gray-200 bg-white'>
      <div className='ij-container flex flex-col items-center justify-between gap-6 py-8 sm:flex-row'>
        <img width={145} src={assets.logo} alt='InsiderJobs' className='max-sm:mx-auto' />
        <p className='flex-1 text-center text-[13px] text-gray-500 sm:border-l sm:border-gray-200 sm:pl-5 sm:text-left'>
          Copyright @SarthakDudhe | All rights reserved.
        </p>
        <div className='flex flex-row gap-3 opacity-80 grayscale'>
          <img width={30} className='cursor-pointer transition-opacity hover:opacity-80' src={assets.facebook_icon} alt='Facebook' />
          <img width={30} className='cursor-pointer transition-opacity hover:opacity-80' src={assets.twitter_icon} alt='Twitter' />
          <img width={30} className='cursor-pointer transition-opacity hover:opacity-80' src={assets.instagram_icon} alt='Instagram' />
        </div>
      </div>
    </footer>
  )
}

export default Footer
