import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${API_BASE_URL}/auth`;

export const loginUser = async (username, password) =>{
    try{
        const response = await axios.post(`${API_URL}/login`,{
        username: username,
        password: password
        });
        if (response.data.token){
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
     }
    catch (error){
    console.error("Login error: ", error);
    throw error;
    }
};

export const registerUser = async (username, email, password, phone = null) =>{
    try{
        const response = await axios.post(`${API_URL}/register`,{
        username: username,
        email: email,
        password: password,
        phone: phone
        });
        if (response.data.token){
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
     }
    catch (error){
    console.error("Register error: ", error);
    throw error;
    }
};

export const loginWithGoogle = async (token) =>{
    try{
        const response = await axios.post(`${API_URL}/google`,{
        token: token
        });
        if (response.data.token){
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
     }
    catch (error){
    console.error("Google login error: ", error);
    throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
};