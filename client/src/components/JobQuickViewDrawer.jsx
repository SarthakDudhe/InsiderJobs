import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ArrowRight, MapPin, Briefcase, DollarSign, Clock, ShieldCheck, Zap, Sparkles } from 'lucide-react'

const JobQuickViewDrawer = ({ job, onClose }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [onClose])

  if (!job) return null

  const handleApply = () => {
    onClose()
    navigate(`/apply-job/${job._id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* Drawer */}
      <div className="drawer-content custom-scrollbar p-6 sm:p-8 flex flex-col justify-between">
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
              <Sparkles size={13} className="text-blue-600" /> Quick View
            </span>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              aria-label="Close drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Company & Title Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 p-2.5 shadow-sm">
              <img
                className="h-9 w-9 object-contain"
                src={job.companyId?.image || '/placeholder.png'}
                alt={job.companyId?.name}
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                {job.companyId?.name || 'Partner Company'}
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-gray-950 mt-1 leading-snug">
                {job.title}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                  <ShieldCheck size={14} /> Verified Posting
                </span>
                <span className="text-gray-300">•</span>
                {(job.hiringActivity || 'active') === 'active' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Active Hiring
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100/60 text-blue-600">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Location</p>
                <p className="text-xs font-bold text-gray-800">{job.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-100/60 text-indigo-600">
                <Briefcase size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Experience</p>
                <p className="text-xs font-bold text-gray-800">{job.level}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-100/60 text-emerald-600">
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Salary Range</p>
                <p className="text-xs font-bold text-emerald-700">
                  {job.salary ? `$${job.salary.toLocaleString()}/yr` : 'Competitive package'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100/60 text-amber-600">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Response Rate</p>
                <p className="text-xs font-bold text-gray-800">
                  {job.companyId?.responseRate || 95}% (in ~{job.companyId?.averageDecisionDays || 3}d)
                </p>
              </div>
            </div>
          </div>

          {/* Job Overview Description */}
          <div className="mb-6">
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap size={16} className="text-blue-600" /> About The Role
            </h3>
            <div
              className="text-sm leading-relaxed text-gray-600 space-y-3 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-6 border-t border-gray-100 mt-6 bg-white sticky bottom-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleApply}
              className="premium-button flex-1 py-3.5 px-6 text-sm font-extrabold shadow-lg shadow-blue-500/20"
            >
              Apply & Analyze Resume Fit <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default JobQuickViewDrawer
