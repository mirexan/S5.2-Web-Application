import axios from 'axios';

const API_URL = 'http://localhost:8080/auth'

export const loginUser = async (username, password) =>{
    try{
        const response = await axios.post(`${API_URL}/login`,{
        username: username,
        password: password
        });
        if (response.data.token){
            localStorage.setItem('userToken', response.data.token);
        }
        return response.data;
     }
    catch (error){
    console.error("Login error: ", error);
    throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('userToken');
};