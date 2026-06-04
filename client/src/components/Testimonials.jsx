import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
    {
        name: "Sarthak Sharma",
        role: "Full Stack Developer",
        content: "The AI matching is accurate—found my dream role at a top firm within a week!",
        rating: 5,
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        name: "Ananya Iyer",
        role: "UI/UX Designer",
        content: "The interface is smooth. I landed three interviews in my first month!",
        rating: 5,
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        name: "Rohan Malhotra",
        role: "Data Scientist",
        content: "Cuts job search time by 70%. Best decision for my professional career.",
        rating: 5,
        avatar: "https://randomuser.me/api/portraits/men/85.jpg"
    }
]

const Testimonials = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 2xl:px-20">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3"
                    >
                        What Our <span className="text-blue-600">Users Say</span>
                    </motion.h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-sm">
                        Thousands of professionals are accelerating their careers with InsiderJobs.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                        >
                            <div>
                                <div className="flex gap-1 mb-4">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <Star key={i} size={14} fill="#f59e0b" className="text-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-gray-700 text-sm italic mb-6 leading-relaxed">
                                    "{item.content}"
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                                    <p className="text-xs text-blue-600 font-medium">{item.role}</p>
                                </div>
                                <Quote className="ml-auto text-gray-100 w-8 h-8" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
