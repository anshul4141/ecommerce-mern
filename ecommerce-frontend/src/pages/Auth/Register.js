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

    // Validation states
    const [isNameValid, setIsNameValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [isAddressValid, setIsAddressValid] = useState(true);
    const [isAnswerValid, setIsAnswerValid] = useState(true);

    // form submission function
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic input validation
        const nameValid = name.trim() !== "";
        const emailValid = email.trim() !== "";
        const passwordValid = password.trim() !== "";
        const phoneValid = phone.trim() !== "";
        const addressValid = address.trim() !== "";
        const answerValid = answer.trim() !== "";

        setIsNameValid(nameValid);
        setIsEmailValid(emailValid);
        setIsPasswordValid(passwordValid);
        setIsPhoneValid(phoneValid);
        setIsAddressValid(addressValid);
        setIsAnswerValid(answerValid);

        if (!nameValid || !emailValid || !passwordValid || !phoneValid || !addressValid || !answerValid) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const res = await axios.post(`http://localhost:5000/api/auth/register`, {
                name, email, password, phone, address, answer
            });

            console.log("data ===>", res.data);

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
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setIsNameValid(true);
                            }}
                            className={`form-control ${!isNameValid ? 'is-invalid' : ''}`}
                            placeholder='Enter your Name'
                        />
                        {!isNameValid && <div className="invalid-feedback">Name is required</div>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setIsEmailValid(true);
                            }}
                            className={`form-control ${!isEmailValid ? 'is-invalid' : ''}`}
                            placeholder='Enter your Email'
                        />
                        {!isEmailValid && <div className="invalid-feedback">Email is required</div>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setIsPasswordValid(true);
                            }}
                            className={`form-control ${!isPasswordValid ? 'is-invalid' : ''}`}
                            placeholder='Enter your Password'
                        />
                        {!isPasswordValid && <div className="invalid-feedback">Password is required</div>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setIsPhoneValid(true);
                            }}
                            className={`form-control ${!isPhoneValid ? 'is-invalid' : ''}`}
                            placeholder='Enter your Phone'
                        />
                        {!isPhoneValid && <div className="invalid-feedback">Phone is required</div>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => {
                                setAddress(e.target.value);
                                setIsAddressValid(true);
                            }}
                            className={`form-control ${!isAddressValid ? 'is-invalid' : ''}`}
                            placeholder='Enter your Address'
                        />
                        {!isAddressValid && <div className="invalid-feedback">Address is required</div>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => {
                                setAnswer(e.target.value);
                                setIsAnswerValid(true);
                            }}
                            className={`form-control ${!isAnswerValid ? 'is-invalid' : ''}`}
                            placeholder='What is Your Favorite sport?'
                        />
                        {!isAnswerValid && <div className="invalid-feedback">Answer is required</div>}
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
