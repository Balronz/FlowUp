import React, { Children, createContext, useContext, useState, useEffect } from "react";
//Navigate for redirectrions after login/logout
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { loginUser, registerUser, logoutUser, verifyTokenRequest } from "../api/auth.js";

//Declare object as null by defect if context is not found
const AuthContext = createContext(null);

//Hook for AuthContext use
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
};


//Provider component: contains LOGIC and STATE 
export const AuthProvider = ({ children }) => {
    //key states
    const [user, setUser] = useState(null); //Loged user's data
    const [loading, setLoading] = useState(true); //Initial verifying session 
    const isAuthenticated = !!user; //To know if someone is logged in
    const navigate = useNavigate();

    //useEffect hook 
    useEffect( () => {
        const checkUser = async() => {
            try{
                const res = await verifyTokenRequest();
                if(res && res.user) {
                    setUser(res.user);
                } else {
                    setUser(null);
                }
            } catch (error){
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    //Functions that interact with backend
    const login = async(email, password) => {
        try{
            const res = await loginUser(email, password);
            setUser(res.user || res);
            navigate('/tasks');
            return { success: true };
        } catch(error){
            setUser(null);
            return { success: false, error: error.message };
        }
    };
    const logout = async() => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            navigate('/login');
        }
    };
    const signup = async(userName, email, password) => {
        try {
            const res = await registerUser(userName, email, password);
            setUser(res.user || res);
            navigate('/tasks');
            return { success: true };
        } catch(error) {
            //In case the email already exists or there's an error
            setUser(null); 
            return { success: false, message: error.message };
        }
    };

    //Object value for components
    const contextValue= {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        signup
    };

    //Provider interface
    return (
        <AuthContext.Provider value={contextValue}>
            {/*children is all the app */}
            {children}
        </AuthContext.Provider>
    );
};




