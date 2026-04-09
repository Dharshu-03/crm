import React from 'react'
import Empnav from "./Empnav.jsx";
import './Empleads.css'
import API from "../api.js";
import { useEffect, useState } from "react";
const Empleads = () => {
    const [leads, setLeads] = useState([]);
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const empId = localStorage.getItem("employeeId");

                const res = await API.get(`/api/leads/my-leads/${empId}`);
                console.log(res.data);
                setLeads(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchLeads();
    }, []);
    return (
        <div>
            <div className="leadheading">
                <div>
                    <h3>Canvo</h3>
                    <p>CRM</p>
                </div>
                <div>
                    <h1> &lt; Leads </h1>
                </div>
            </div>
            <div className='empleadmain'>

                <div className="empleadsearch">
                    <img src="/images/search.png" alt="" />
                    <input type="text" />
                </div>

                <div className="leadcards">


                    {leads.map((lead) => (

                        <div className="lc" key={lead._id}>
                            <div className="info">
                                <div className={`imp ${lead.type}`}>
                                    <h1>{lead.name}</h1>
                                    <p>{lead.email}</p>
                                </div>
                                <div>
                                    <img src="/images/calendar.png" alt="" />
                                    <h3>{new Date(lead.assignedDate).toLocaleDateString()}</h3>
                                </div>
                            </div>
                            <div className="buttons">
                                <div className={`ring ${lead.type}`}>
                                    <span className="text">{lead.status}</span>
                                </div>

                                <div className='dummy'>
                                    <div className="lcbtn">
                                        <img src="/images/lc1.png" alt="" />
                                    </div>
                                    <div className="lcbtn">
                                        <img src="/images/lc2.png" alt="" />
                                    </div>
                                    <div className="lcbtn">
                                        <img src="/images/lc3.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Empnav></Empnav>
        </div>
    )
}

export default Empleads;