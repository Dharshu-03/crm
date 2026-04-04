import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from './Navbar.jsx'
import './Employee.css'
import { useEffect } from "react";
import API from "../api";
const Employee = () => {

    const [search, setSearch] = useState("");
    const [showTypePopup, setShowTypePopup] = useState(false);
    const [email, setEmail] = useState("");
    const [fname, setfname] = useState("");
    const [lname, setlname] = useState("");
    const [location, setlocation] = useState("");
    const [language, setlanguage] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fname || !lname || !email || !location || !language) {
            alert("All fields are required");
            return;
        }
        try {
            await API.post("/api/employees/add", {
                fname,
                lname,
                email,
                location,
                language
            });

            alert("Employee added successfully");

            setfname("");
            setlname("");
            setEmail("");
            setlocation("");
            setlanguage("");

        } catch (err) {
            console.error(err);
            alert("Failed to add employee");
        }
    };
    return (
        <>
            <div className='employees'>
                <Nav />
                <div className='empmain'>
                    <div className="search">
                        <img src="/images/magnify.png" alt="" />
                        <input
                            type="search"
                            placeholder="Search here..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <hr />
                    <div className="empbeforetab">
                        <h3>Home   &gt;   Employees</h3>
                        <button onClick={() => setShowTypePopup(true)} id="addemp">Add Employees</button>
                    </div>
                    <div className='emptab'>

                        <div className="empbox"></div>
                        {
                            showTypePopup && (
                                <div className="popup-overlay-emp" onClick={() => setShowTypePopup(false)}>
                                    <div className="emppopup" onClick={(e) => e.stopPropagation()}>
                                        <div className='emppopupheading'>
                                            <h3>Add new Lead</h3>
                                            <img onClick={() => setShowTypePopup(false)} src="/images/close.png" alt="" />
                                        </div>
                                        <form onSubmit={handleSubmit} action="">
                                            <div className="input-group"><label>First Name</label><input value={fname} onChange={e => setfname(e.target.value)} /></div>
                                            <div className="input-group"><label>Last Name</label><input value={lname} onChange={e => setlname(e.target.value)} /></div>
                                            <div className="input-group"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
                                            <div className="input-group"><label>Location</label><input value={location} onChange={e => setlocation(e.target.value)} /></div>
                                            <div className="input-group"><label>Preferred Language</label><input value={language} onChange={e => setlanguage(e.target.value)} /></div>
                                            <button className='save' type="submit">Save</button>
                                        </form>

                                    </div>
                                </div>
                            )
                        }


                    </div>
                </div >

            </div >
        </>
    )
}


export default Employee;