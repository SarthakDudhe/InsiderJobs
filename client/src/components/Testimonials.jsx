import React from 'react'
import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

const MotionH2 = motion.h2
const MotionDiv = motion.div

const testimonials = [
  {
    name: 'Sarthak Sharma',
    role: 'Full Stack Developer',
    content: 'The AI matching felt much more intentional than a normal job board. I found relevant roles fast.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Ananya Iyer',
    role: 'UI/UX Designer',
    content: 'The application tracking made the whole process feel calmer. I knew exactly where I stood.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Rohan Malhotra',
    role: 'Data Scientist',
    content: 'The recruiter flow is clean and serious. It feels like a product companies would actually use.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
  }
]

const Testimonials = () => {
  return (
    <section className='bg-gray-50 py-20'>
      <div className='ij-container'>
        <div className='mb-12 text-center'>
          <p className='section-kicker mb-3'>Outcomes</p>
          <MotionH2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mb-3 text-3xl font-extrabold text-gray-950 md:text-5xl'
          >
            Built for confident hiring decisions.
          </MotionH2>
          <p className='mx-auto max-w-2xl text-gray-600'>
            Candidates get clearer opportunities. Recruiters get a cleaner way to move from interest to shortlist.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {testimonials.map((item, index) => (
            <MotionDiv
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`premium-panel flex flex-col justify-between rounded-[1.35rem] p-6 ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div>
                <div className='mb-5 flex gap-1'>
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={15} fill='#d97706' className='text-amber-600' />
                  ))}
                </div>
                <p className='mb-7 text-sm leading-relaxed text-gray-700'>"{item.content}"</p>
              </div>
              <div className='flex items-center gap-3'>
                <img src={item.avatar} alt={item.name} className='h-11 w-11 rounded-full object-cover ring-4 ring-gray-100' />
                <div>
                  <h4 className='text-sm font-extrabold text-gray-950'>{item.name}</h4>
                  <p className='text-xs font-bold text-blue-600'>{item.role}</p>
                </div>
                <Quote className='ml-auto h-8 w-8 text-gray-100' />
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
