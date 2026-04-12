import React from 'react'
import { NavLink } from 'react-router-dom';
import './Empnav.css'

const Empnav = () => {
    return (
        <div className='empnav'>

            <NavLink to="/home">
                {({ isActive }) => (
                    <div className={isActive ? "empnavcomp active" : "empnavcomp"}>
                        <img src={isActive ? "/images/active1.png" : "/images/enav1.png"} alt="" />
                        <p>Home</p>
                    </div>
                )}
            </NavLink>

            <NavLink to="/empleads">
                {({ isActive }) => (
                    <div className={isActive ? "empnavcomp active" : "empnavcomp"}>
                        <img src={isActive ? "/images/active2.png" : "/images/enav2.png"} alt="" />
                        <p>Leads</p>
                    </div>
                )}
            </NavLink>

            <NavLink to="/schedule">
                {({ isActive }) => (
                    <div className={isActive ? "empnavcomp active" : "empnavcomp"}>
                        <img src={isActive ? "/images/active3.png" : "/images/enav3.png"} alt="" />
                        <p>Schedule</p>
                    </div>
                )}
            </NavLink>

            <NavLink to="/empsettings">
                {({ isActive }) => (
                    <div className={isActive ? "empnavcomp active" : "empnavcomp"}>
                        <img src={isActive ? "/images/active4.png" : "/images/enav4.png"} alt="" />
                        <p>Profile</p>
                    </div>
                )}
            </NavLink>

        </div>
    )
}

export default Empnav;