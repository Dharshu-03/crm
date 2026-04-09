import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import './Empnav.css'
const Empnav = () => {
    return (
        <div className='empnav'>
            <NavLink to="/home" className="empnavcomp"><img src="/images/enav1.png" alt="" />
                <p>Home</p></NavLink>
            <NavLink to="/empleads" className="empnavcomp"><img src="/images/enav2.png" alt="" />
                <p>Leads</p></NavLink>
            <NavLink to="/schedule" className="empnavcomp"><img src="/images/enav3.png" alt="" />
                <p>Schedule</p></NavLink>
            <NavLink to="/empsettings" className="empnavcomp"><img src="/images/enav4.png" alt="" />
                <p>Profile</p></NavLink>
        </div >
    )
}
export default Empnav;