import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from './Navbar.jsx'
import './Settings.css'

import { useEffect } from "react";





const Settings = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [fname, setfname] = useState("");
    const [lname, setlname] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();


    // useEffect(() => {
    //     const storedEmail = localStorage.getItem("email");
    //     setEmail(storedEmail);

    //     const fetchUser = async () => {
    //         try {
    //             const res = await API.get(`/api/auth/user/${storedEmail}`);

    //             setfname(res.data.fname || "");
    //             setlname(res.data.lname || "");

    //         } catch (err) {
    //             console.error(err);
    //         }
    //     };

    //     fetchUser();
    // }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== "") {
            if (password.length < 8) return setError("Password too short");
            if (password !== confirm) return setError("Passwords do not match");
        }
        if (fname.length < 3) return setError("first name too short");
        if (lname.length < 3) return setError("last name too short");
        const payload = { email, fname, lname };
        if (password) payload.password = password;
        // try {
        //     await API.put("/update", payload);
        //     alert("Profile updated successfully");
        //     setError("");
        //     setPassword("");
        //     setConfirm("");
        // }
        // catch (err) {
        //     setError(err.response?.data?.msg || "Login failed");
        // }


    };
    return (
        <>
            <div className='settings'>
                <Nav />
                <div className='main'>
                    <h3></h3>
                    <hr />
                    <div className="beforetab">
                        <h3>Home   &gt;   Settings</h3>
                        <div className='tab'>
                            <h2>Edit Profile</h2>
                            <hr style={{ width: "93%", marginLeft: "25px", border: "2px solid #9F9F9F" }} />
                            <form onSubmit={handleSubmit}>
                                <div className="content">
                                    <div className="input-group"><label>First Name</label><input value={fname} onChange={e => setfname(e.target.value)} /></div>
                                    <div className="input-group"><label>Last Name</label><input value={lname} onChange={e => setlname(e.target.value)} /></div>
                                    <div className="input-group"><label>Email</label><input disabled value={email} onChange={e => setEmail(e.target.value)} /></div>
                                    <div className="input-group"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
                                    <div className="input-group"><label>Confirm Password</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} /></div>
                                    {error && <div className="error">{error}</div>}
                                </div>
                                <button className="btn"> Save</button>
                            </form>

                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
export default Settings;