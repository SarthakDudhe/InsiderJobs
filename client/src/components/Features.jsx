import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Target, Globe, Shield, MessageSquare, LineChart } from 'lucide-react'

const features = [
    {
        icon: <Zap className="text-yellow-500" />,
        title: "AI-Powered Matching",
        description: "Our advanced algorithms match your profile with the perfect job opportunities in seconds."
    },
    {
        icon: <Target className="text-blue-500" />,
        title: "Precision Search",
        description: "Filter through thousands of jobs with elite precision to find exactly what fits your career goals."
    },
    {
        icon: <Globe className="text-green-500" />,
        title: "Global Reach",
        description: "Connect with industry leaders and top-tier companies from every corner of the globe."
    },
    {
        icon: <Shield className="text-purple-500" />,
        title: "Verified Listings",
        description: "Apply with confidence. Every job on our platform is thoroughly verified for authenticity."
    },
    {
        icon: <MessageSquare className="text-pink-500" />,
        title: "Instant Connection",
        description: "Communicate directly with recruiters through our integrated messaging system."
    },
    {
        icon: <LineChart className="text-indigo-500" />,
        title: "Career Tracking",
        description: "Monitor your application status and career growth with our interactive analytics dashboard."
    }
]

const Features = () => {
    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-4 2xl:px-20">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
                    >
                        Why Choose <span className="text-blue-600">InsiderJobs?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 max-w-2xl mx-auto"
                    >
                        We provide the tools and connections you need to navigate the modern job market with ease and confidence.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="p-6 md:p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {React.cloneElement(feature.icon, { size: 28 })}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
