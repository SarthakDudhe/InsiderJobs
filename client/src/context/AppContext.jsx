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
    
    const [userToken, setUserToken] = useState(null)
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
                const msg = data.message || ''
                const isAuthErr = msg.includes('jwt') || msg.includes('Expired') || msg.includes('Authorized') || msg.includes('Company not found') || msg.includes('Session')
                if (isAuthErr) {
                    setCompanyToken(null)
                    setcompanyData(null)
                    localStorage.removeItem('companyToken')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.error("fetchCompanyData error:", error.message)
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
                const msg = data.message || ''
                const isAuthErr = msg.includes('jwt') || msg.includes('Expired') || msg.includes('Authorized') || msg.includes('User not found') || msg.includes('Session')
                if (isAuthErr) {
                    setUserData(null)
                    setUserToken(null)
                    localStorage.removeItem('userToken')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.error("fetchUserData error:", error.message)
        }
    }

    //Fetch user applied applications
    const fetchUserApplications = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/users/applications', { headers: { Authorization: `Bearer ${userToken}` } })
            if (data.success) {
                setUserApplications(data.application)
            } else {
                const msg = data.message || ''
                const isAuthErr = msg.includes('jwt') || msg.includes('Expired') || msg.includes('Authorized') || msg.includes('User not found') || msg.includes('Session')
                if (isAuthErr) {
                    setUserApplications([])
                    setUserData(null)
                    setUserToken(null)
                    localStorage.removeItem('userToken')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.error("fetchUserApplications error:", error.message)
        }
    }

    useEffect(() => {
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken')
        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
        }

        const storedUserToken = localStorage.getItem('userToken')
        if (storedUserToken) {
            setUserToken(storedUserToken)
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
