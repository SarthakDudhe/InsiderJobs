import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { Smartphone, QrCode } from 'lucide-react'

const AppDownload = () => {
    return (
        <section className='container px-4 2xl:px-20 mx-auto my-16'>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className='relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-800 p-6 md:p-12 rounded-3xl shadow-xl text-white font-sans'
            >
                <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8'>
                    <div className='flex-1 text-center md:text-left'>
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-4">
                            <Smartphone size={14} /> Mobile App
                        </span>
                        <h2 className='text-2xl md:text-4xl font-bold mb-4 leading-tight'>
                            Job Search <span className="text-blue-100">On The Go</span>
                        </h2>
                        <p className="text-blue-50 text-sm mb-8 max-w-md mx-auto md:mx-0 opacity-90">
                            Get instant alerts and track applications directly from your phone.
                        </p>

                        <div className='flex flex-wrap items-center gap-4 justify-center md:justify-start'>
                            <div className="flex gap-3">
                                <motion.a whileHover={{ y: -3 }} href="#" className='transition-all'>
                                    <img className='h-10 rounded-lg' src={assets.play_store} alt="Play Store" />
                                </motion.a>
                                <motion.a whileHover={{ y: -3 }} href="#" className='transition-all'>
                                    <img className='h-10 rounded-lg' src={assets.app_store} alt="App Store" />
                                </motion.a>
                            </div>

                            <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-white/20">
                                <div className="p-2 bg-white rounded-xl">
                                    <QrCode size={32} className="text-gray-900" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-bold uppercase tracking-wider">Scan to Download</p>
                                    <p className="text-[10px] text-blue-200">iOS & Android</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='relative md:w-1/3 flex justify-center mt-8 md:mt-0'>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <img
                                className='w-40 md:w-56 drop-shadow-2xl'
                                src={assets.app_main_img}
                                alt="App Interface"
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default AppDownload