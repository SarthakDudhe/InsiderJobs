import React, { Suspense, lazy, useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import 'quill/dist/quill.snow.css'
import { ToastContainer } from 'react-toastify';

const Home = lazy(() => import('./Pages/Home'))
const ApplyJob = lazy(() => import('./Pages/ApplyJob'))
const Application = lazy(() => import('./Pages/Application'))
const AIJobRecommender = lazy(() => import('./Pages/AIJobRecommender'))
const Opportunities = lazy(() => import('./Pages/Opportunities'))
const RecruiterLogin = lazy(() => import('./components/RecruiterLogin'))
const UserLogin = lazy(() => import('./components/UserLogin'))
const Dashboard = lazy(() => import('./Pages/Dashboard'))
const AddJob = lazy(() => import('./Pages/AddJob'))
const ManageJobs = lazy(() => import('./Pages/ManageJobs'))
const ViewApplications = lazy(() => import('./Pages/ViewApplications'))

const App = () => {

  const { showRecruiterLogin, showUserLogin, companyToken } = useContext(AppContext)
  return (
    <div>
      <ToastContainer />
      <Suspense fallback={<AppFallback />}>
        {showRecruiterLogin && <RecruiterLogin />}
        {showUserLogin && <UserLogin />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/apply-job/:id' element={<ApplyJob />} />
          <Route path='/applications' element={<Application />} />
          <Route path='/ai-recommender' element={<AIJobRecommender />} />
          <Route path='/opportunities' element={<Opportunities />} />
          <Route path='/dashboard' element={<Dashboard />}>
            {companyToken ? (
              <>
                <Route path='add-job' element={<AddJob />} />
                <Route path='manage-jobs' element={<ManageJobs />} />
                <Route path='view-applications' element={<ViewApplications />} />
              </>
            ) : null}
          </Route>
        </Routes>
      </Suspense>
    </div>
  )
}

const AppFallback = () => (
  <div className='ij-shell flex min-h-screen items-center justify-center p-6'>
    <div className='rounded-2xl border border-blue-100 bg-white/85 p-5 text-center shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl'>
      <div className='mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600' />
      <p className='mt-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400'>Loading workspace</p>
    </div>
  </div>
)

export default App
