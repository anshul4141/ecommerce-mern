import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();

    const navigate = useNavigate();

    // form submission function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/auth/login`, {
                email, password
            });

            console.log(res.data);

            if (res.data.success) {
                toast.success("User Registration Successfully. Please Login");
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                });
                localStorage.setItem('auth', JSON.stringify(res.data))
                navigate('/');
            } else {
                toast.error(res.data.message || "Registration failed");
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    }

    return (
        <Layout>
            <div className='form-container'>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder='Enter your Email' required />
                    </div>
                    <div className="mb-3">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder='Enter your Password' required />
                    </div>

                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">SignIn</button>
                        <Link to="/register" className="btn btn-secondary">SignUp</Link>
                    </div>

                    {/* Forgot Password Link */}
                    <div align="center" className="mt-3">
                        <Link to="/forgot-password" className="forgot-password-link">Forgot your password?</Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default Login;
