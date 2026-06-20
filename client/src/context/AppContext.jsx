import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppcontextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [searchFilter, setSearchFilter] = useState({
        title: "",
        location: ""
    })

    const [isSearched, setIsSearched] = useState(false)
    const [jobs, setjobs] = useState([])
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setcompanyData] = useState(null)
    
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || null)
    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState([])
    const [totalJobs, setTotalJobs] = useState(0)

    //  Function to fetch job data
    const fetchJobs = async (page = 1, limit = 6, title = '', location = '', categories = '', locations = '') => {
        try {
            const params = new URLSearchParams()
            if (page) params.append('page', page)
            if (limit) params.append('limit', limit)
            if (title) params.append('title', title)
            if (location) params.append('location', location)
            if (categories) params.append('categories', categories)
            if (locations) params.append('locations', locations)

            const { data } = await axios.get(`${backendUrl}/api/jobs?${params.toString()}`)
            if (data.success) {
                setjobs(data.jobs)
                setTotalJobs(data.totalJobs || 0)
                console.log(data.jobs)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Function to fetch Company Data
    const fetchCompanyData = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/company/company", { headers: { token: companyToken } })
            if (data.success) {
                setcompanyData(data.company)
            }
            else {
                toast.error(data.message)
                if (data.message === 'jwt expired' || data.message === "Session Expired, Login Again") {
                    setCompanyToken(null)
                    setcompanyData(null)
                    localStorage.removeItem('companyToken')
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Function to fetch User Data
    const fetchUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/users/user', { headers: { Authorization: `Bearer ${userToken}` } })
            if (data.success) {
                setUserData(data.user)
            }
            else {
                toast.error(data.message)
                if (data.message === 'jwt expired' || data.message === "Session Expired, Login Again") {
                    setUserData(null)
                    setUserToken(null)
                    localStorage.removeItem('userToken')
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Fetch user applied applications
    const fetchUserApplications = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/users/applications', { headers: { Authorization: `Bearer ${userToken}` } })
            if (data.success) {
                setUserApplications(data.application)
            } else {
                toast.error(data.message)
                if (data.message === 'jwt expired' || data.message === "Session Expired, Login Again") {
                    setUserApplications([])
                    setUserData(null)
                    setUserToken(null)
                    localStorage.removeItem('userToken')
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken')
        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
        }
    }, [])

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData()
        }
    }, [companyToken])

    useEffect(() => {
        if (userToken) {
            fetchUserData()
            fetchUserApplications()
        } else {
            setUserData(null)
            setUserApplications([])
        }
    }, [userToken])

    const value = {
        searchFilter, setSearchFilter, isSearched, setIsSearched, jobs, setjobs, showRecruiterLogin, setShowRecruiterLogin, showUserLogin, setShowUserLogin, companyToken, setCompanyToken, companyData, setcompanyData, backendUrl, userToken, setUserToken, userData, userApplications, setUserData, setUserApplications, fetchUserData, fetchUserApplications, totalJobs, setTotalJobs, fetchJobs
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}