import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";



/**
 * @desc RegisterPage, component for the registration of users
 * Manages the local state of the form and delegates all the logic to AuthContext
 */

 const RegisterPage = () => {
    //useState -> FORM
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState(null);
    const [isSubmiting, setIsSubmiting] = useState(false);

    //Functions and state of context auth
    const { signup, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    /**
     * Route protection
     * if user exists redirect
     */
    useEffect( ()=> {
        if(isAuthenticated) {
            navigate('/app/tasks');
        }
    }, [isAuthenticated, navigate]); 

    /**
     * handleChange: to update input
     * Uses 'name' attribute to map the state
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    //handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        //Client validation
        if(formData.password.length < 6 ){
            return setError("Password must contain at least 6 characters");
        }
        if(formData.password !== formData.confirmPassword){
            return setError("Passwords do not match");
        }
        
        setIsSubmiting(true);
        
        //Send data to AuthContext
        try{
            const result = await signup(formData.userName, formData.email, formData.password);
            if(result.success) {
                //Redirect to login
                navigate('/login', {
                    state: { message: "Account created successfully! Please log in." }
                });
            } else {
                setError(result.error || "An error ocurred during registration.");
                setIsSubmiting(false)
            }
        } catch (err){
            setError("Connection failed. Please try again later.");
            setIsSubmiting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                
                <div className="text-center mb-8">
                    <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">FlowUp</h1>
                    <p className="text-slate-500 mt-2 font-medium text-lg">Register</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-xl flex items-center animate-pulse">
                        <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-bold">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1">User</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                name="userName"
                                required
                                value={formData.userName}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                placeholder="User Name"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                placeholder="Email"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                    placeholder="*****"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                    placeholder="••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmiting}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmiting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                LOADING...
                            </>
                        ) : (
                            "SIGN UP"
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-500 font-medium">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">
                            LOGIN
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;