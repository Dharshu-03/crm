import React, { useState } from "react";
import './Navbar.css'
import { NavLink } from 'react-router-dom';


const Navbar = () => {



    return (
        <>
            <div className='nav'>
                <div className="top">
                    <h4>Canva<a>CRM</a></h4>

                    <hr />
                    <NavLink to="/dashboard">  <div className="sub">

                        <h4>Dashboard</h4>
                    </div>
                    </NavLink>
                    <NavLink to="/lead">  <div className="sub">

                        <h4>Leads</h4>
                    </div></NavLink>
                    <NavLink to="/employee"><div className="sub">

                        <h4>Employees</h4>
                    </div></NavLink>

                    <NavLink to="/settings"><div className="sub">

                        <h4>Settings</h4>
                    </div></NavLink >

                </div>

            </div>
        </>
    )
}

export default Navbar;