import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [answer, setAnswer] = useState("");
    // form submission function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/auth/register`, {
                name, email, password, phone, address, answer
            });

            console.log(res.data);

            if (res.data.success) {
                toast.success("User Registration Successfully. Please Login");
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
                <h1>User Registration</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder='Enter your Name' required />
                    </div>
                    <div className="mb-3">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder='Enter your Email' required />
                    </div>
                    <div className="mb-3">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder='Enter your Password' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" placeholder='Enter your Phone' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" placeholder='Enter your Address' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} className="form-control" placeholder='What is Your Favorite sports' required />
                    </div>
                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">SignUp</button>
                        <Link to="/login" className="btn btn-secondary">SignIn</Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default Register;