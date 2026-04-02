import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from './Navbar.jsx'
import './Lead.css'
import { useEffect } from "react";
const Lead = () => {

    const [search, setSearch] = useState("");
    return (
        <>
            <div className='leads'>
                <Nav />
                <div className='leadmain'>
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
                    <div className="leadbeforetab">
                        <h3>Home   &gt;   Settings</h3>
                        <div>
                            <button className='add'>Add Manually</button>
                            <button className='add'>Add CSV</button>
                        </div>
                    </div>
                    <div className='leadtab'>



                    </div>
                </div>

            </div>
        </>
    )
}
export default Lead;