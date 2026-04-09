import React from 'react'
import Empnav from "./Empnav.jsx";
import './Empleads.css'
import API from "../api.js";
import { useEffect, useState } from "react";
const Empleads = () => {
    const [leads, setLeads] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
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

    const updateType = async (type) => {
        try {
            await API.put(`/api/leads/update-type/${selectedLead._id}`, {
                type
            });

            // ✅ Update UI instantly
            setLeads((prev) =>
                prev.map((l) =>
                    l._id === selectedLead._id ? { ...l, type } : l
                )
            );

            setShowPopup(false);
        } catch (err) {
            console.error(err);
        }
    };
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
                                    <div className="lcbtn" onClick={(e) => {
                                        setSelectedLead(lead);
                                        setShowPopup(true);
                                        setPopupPos({ x: e.clientX, y: e.clientY })
                                    }}>
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
            {
                showPopup && (
                    <>
                        {/* 🔥 Overlay */}
                        <div className="overlay" onClick={() => setShowPopup(false)}></div>

                        {/* 🔥 Popup */}
                        <div
                            className="type-popup"
                            style={{
                                top: popupPos.y + 90,
                                left: popupPos.x - 70,
                                position: "absolute"
                            }}
                        >
                            <h3>Type</h3>

                            <div className='btn1' onClick={() => updateType("hot")}> Hot</div>
                            <div className='btn2' onClick={() => updateType("warm")}> Warm</div>
                            <div className='btn3' onClick={() => updateType("cold")}> Cold</div>
                        </div>
                    </>
                )
            }
        </div>

    )

}

export default Empleads;