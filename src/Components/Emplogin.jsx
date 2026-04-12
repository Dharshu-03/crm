import React, { useState } from 'react';
import './Emplogin.css';
import API from "../api";   // ✅ your axios instance
import { useNavigate } from 'react-router-dom';

const Emplogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/api/employees/login", {
                email,
                password
            });

            console.log("LOGIN SUCCESS:", res.data);

            localStorage.setItem("employeeToken", res.data.token);  // match api.js
            localStorage.setItem("employeeId", res.data.employee.id);
            localStorage.setItem("employeeName", `${res.data.employee.fname} ${res.data.employee.lname}`);

            navigate("/empsettings");  // redirect

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className='emplogin'>
            <form className='emploginform' onSubmit={handleLogin}>
                <div>
                    <h1>Canova</h1><p>CRM</p>
                </div>

                <input
                    type="email"
                    placeholder='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type='submit'>Submit</button>
            </form>
        </div>
    );
};

export default Emplogin;