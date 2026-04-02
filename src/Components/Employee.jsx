import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from './Navbar.jsx'
import './Employee.css'
import { useEffect } from "react";
const Employee = () => {

    const [search, setSearch] = useState("");
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
                        <button id="addemp">Add Employees</button>
                    </div>
                    <div className='emptab'>

                        <div className="empbox"></div>

                    </div>
                </div>

            </div>
        </>
    )
}
export default Employee;