import React from 'react';
import './Empsettings.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Empnav from "./Empnav.jsx";
import API from "../api.js";
import { useEffect } from "react";

const Empsettings = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [fname, setfname] = useState("");
    const [lname, setlname] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== "") {
            if (password.length < 8) return setError("Password too short");
            if (password !== confirm) return setError("Passwords do not match");
        }

        if (fname.length < 3) return setError("First name too short");
        if (lname.length < 3) return setError("Last name too short");

        try {
            const payload = { fname, lname };
            if (password) payload.password = password;

            const id = localStorage.getItem("employeeId");

            await API.put(`/api/employees/${id}`, payload);

            alert("Profile updated ✅");
            setError("");
        } catch (err) {
            console.error(err);
            setError("Update failed");
        }
    };
    useEffect(() => {
        const loadProfile = async () => {
            const id = localStorage.getItem("employeeId");

            if (!id) {
                console.error("No employee ID found");
                navigate("/login");
                return;
            }

            try {
                const res = await API.get(`/api/employees/${id}`);

                setfname(res.data.fname);
                setlname(res.data.lname);
                setEmail(res.data.email);
            } catch (err) {
                console.error(err);
            }
        };

        loadProfile();
    }, []);
    return (
        <div>
            <div className="profileheading">
                <div>
                    <h3>Canvo</h3>
                    <p>CRM</p>
                </div>
                <div>
                    <h1> &lt; Profile </h1>
                </div>
            </div>
            <div className='empsettmain'>





                <form onSubmit={handleSubmit}>
                    <div className="empsettcontent">
                        <div className="input-group"><label>First Name</label><input value={fname} onChange={e => setfname(e.target.value)} /></div>
                        <div className="input-group"><label>Last Name</label><input value={lname} onChange={e => setlname(e.target.value)} /></div>
                        <div className="input-group"><label>Email</label><input disabled value={email} onChange={e => setEmail(e.target.value)} /></div>
                        <div className="input-group"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
                        <div className="input-group"><label>Confirm Password</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} /></div>
                        {error && <div className="error">{error}</div>}
                    </div>
                    <button type='submit' className="svbtn"> Save</button>
                    <button type="button" className="lgbtn" onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("employeeId");
                        navigate("/emplogin");
                    }}>
                        Logout
                    </button>
                </form>



            </div>
            <Empnav></Empnav>
        </div>
    )
}

export default Empsettings;


