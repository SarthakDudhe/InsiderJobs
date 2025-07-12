import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import ApplyJob from './Pages/ApplyJob'
import Application from './Pages/Application'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './Pages/Dashboard'
import AddJob from './Pages/AddJob'
import ManageJobs from './Pages/ManageJobs'
import ViewApplications from './Pages/ViewApplications'
import 'quill/dist/quill.snow.css'
const App = () => {

  const {showRecruiterLogin} = useContext(AppContext)
  return (
    <div>
    { showRecruiterLogin && <RecruiterLogin/>}
      <Routes>
        <Route path='/' element={<Home/>}/>
         <Route path='/apply-job/:id' element={<ApplyJob/>}/>
          <Route path='/applications' element={<Application/>}/>
          {/* <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='add-job' element={<AddJob/>}  />
          <Route path='manage-jobs' element={<ManageJobs/>} />
          <Route path='view-applications' element={<ViewApplications/>} /> */}


            {/* Nest these under /dashboard */}
  <Route path='/dashboard' element={<Dashboard />}>
    <Route path='add-job' element={<AddJob />} />
    <Route path='manage-jobs' element={<ManageJobs />} />
    <Route path='view-applications' element={<ViewApplications />} />
  </Route>
      </Routes>
    </div>
  )
}

export default App