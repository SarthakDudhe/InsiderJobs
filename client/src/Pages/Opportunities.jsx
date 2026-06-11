import React from 'react'
import Navbar from '../components/Navbar'
import JobListing from '../components/JobListing'
import Footer from '../components/Footer'

const Opportunities = () => {
    return (
        <div className='min-h-screen ij-shell'>
            <Navbar />
            <div className='pt-8'>
                <JobListing />
            </div>
            <Footer />
        </div>
    )
}

export default Opportunities
