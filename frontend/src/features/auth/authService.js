// Note that: Service is strictly for making HTTP request and sending data back
// and setting any data to local storage

import axios from 'axios'  // earlier we were using postman to access our backend REST end points, now we will use axios from inside our frotend app

const API_URL = '/api/users/'

// Register user
const register = async (userData) => {
    const response = await axios.post(API_URL, userData)

    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

// Login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData)

    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

const logout = () => {
    localStorage.removeItem('user')
    // we could use a server and http only cookie , but this a pretty introductory course
}

const authService = {
    register,
    logout,
    login
}

export default authService
