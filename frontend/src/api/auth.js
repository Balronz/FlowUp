import axios from 'axios';

const loginUrl = '/api/auth/login';
const registerUrl = '/api/auth/register';
const logoutUrl = '/api/auth/logout';
const verifyUrl = '/api/auth/user';


//Function for loginUser
export const loginUser = async (email, password) => {
    const data = { email, password };
    try{
        const response = await axios.post(loginUrl, data, { withCredentials: true });
        return response.data;
    }catch(error){
        throw new Error(error.response?.data?.error || 'Conection error');
    }
};

//Function for register user
export const registerUser = async(userName, email, password) => {
    const data = {
        userName,
        email,
        password
    };
    try{
        const response = await axios.post(registerUrl, data, { withCredentials: true });
        return response.data.user;
    } catch(error){
        throw new Error(error.response?.data?.error || 'Register error');
    }
};

//Function for logout user
export const logoutUser = async() => {
    try{
        const response = await axios.post(logoutUrl, null, { withCredentials: true });
        return { success: true, status: response.status };
    } catch(error){
        throw new Error(error.response?.data?.error || 'Logout error');
    }
};

//Function to verify token
export const verifyTokenRequest = async() => {
    try{
        const response = await axios.get(verifyUrl, { withCredentials: true });
        return response.data;
    }catch(error) {
        throw new Error(error.response?.data?.error || 'Token verification error');
    }
};