import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
export const AppContext = createContext()




export const AppcontextProvider = (props) => {


    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const { user } = useUser()
    const { getToken } = useAuth()



    const [searchFilter, setSearchFilter] = useState({
        title: "",
        location: ""
    })

    const [isSearched, setIsSearched] = useState(false)

    const [jobs, setjobs] = useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setcompanyData] = useState(null)
    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState([])


    //  Function to fetch job data

    const fetchJobs = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/jobs')
            if (data.success) {
                setjobs(data.jobs)
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
                console.log(data);

            }
            else {
                toast.error(data.message)
            }


        } catch (error) {
            toast.error(error.message)
        }
    }


    //Function to fetch User Data

    const fetchUserData = async () => {
        try {

            const token = await getToken()

            const { data } = await axios.get(backendUrl + '/api/users/user', { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setUserData(data.user)
            }
            else {
                toast.error(data.message)
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
        if (user) {
            fetchUserData()
        }
    }, [user])


    const value = {
        searchFilter, setSearchFilter, isSearched, setIsSearched, jobs, setjobs, showRecruiterLogin, setShowRecruiterLogin, companyToken, setCompanyToken, companyData, setcompanyData, backendUrl, userData, userApplications, setUserData, setUserApplications, fetchUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}