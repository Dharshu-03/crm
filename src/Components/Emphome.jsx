import React from 'react'
import Empnav from "./Empnav.jsx";
import API from "../api.js";
import './Emphome.css'

const Emphome = () => {
    return (
        <div>
            <div className="homeheading">
                <div>
                    <h3>Canvo</h3>
                    <p>CRM</p>
                </div>
                <div>
                    <h6>Good Morning</h6>
                    <h1> name </h1>
                </div>
            </div>
            <div className="homemain">
                <h3>Timing</h3>

                <div className="time">
                    <div>
                        <div className="checkin">
                            <h5>Check in</h5>
                            <h5>-----</h5>
                        </div>
                        <div className="checkin">
                            <h5>Check out</h5>
                            <h5>--:--</h5>
                        </div>
                    </div>
                    <button className='inout'></button>

                </div>


                <div className="break">
                    <div className="time">
                        <div>
                            <div className="checkin">
                                <h5>Break</h5>
                                <h5>--:--</h5>
                            </div>
                            <div className="checkin">
                                <h5>Check out</h5>
                                <h5>--:--</h5>
                            </div>
                        </div>
                        <button className='breakbtn'></button>

                    </div>
                    <div className="pastbreaks">

                        <div className="pastbreak">

                            <div className="first">
                                <div >
                                    <h5>Break</h5>
                                    <h5>--:--</h5>
                                </div>
                                <div >
                                    <h5>Ended</h5>
                                    <h5>--:--</h5>
                                </div>
                            </div>
                            <div>
                                <h5>Date</h5>
                                <h5>--:--</h5>
                            </div>

                        </div>
                    </div>

                </div>

                <h3>Recent Activity</h3>

                <div className="homeactivity"></div>

            </div>
            <Empnav></Empnav>
        </div>
    )
}

export default Emphome;