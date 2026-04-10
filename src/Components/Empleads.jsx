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
    const [showSchedulePopup, setShowSchedulePopup] = useState(false);
    const [scheduleLead, setScheduleLead] = useState(null);
    const [scheduleData, setScheduleData] = useState({
        date: "",
        time: ""
    });
    const [showStatusPopup, setShowStatusPopup] = useState(false);
    const [statusLead, setStatusLead] = useState(null);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");

    const [showInfoPopup, setShowInfoPopup] = useState(false);
    const [infoPos, setInfoPos] = useState({ x: 0, y: 0 });
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

    const updateStatus = async () => {
        try {
            await API.put(`/api/leads/update-status/${statusLead._id}`, {
                status
            });

            // update UI
            setLeads((prev) =>
                prev.map((l) =>
                    l._id === statusLead._id ? { ...l, status } : l
                )
            );

            setShowStatusPopup(false);
            setShowInfoPopup(false);

        } catch (err) {
            console.error(err);
        }
    };
    const saveSchedule = async () => {
        try {
            const { date, time } = scheduleData;

            const scheduledDate = new Date(`${date}T${time}`);

            await API.put(`/api/leads/update-schedule/${scheduleLead._id}`, {
                scheduledDate
            });

            setLeads((prev) =>
                prev.map((l) =>
                    l._id === scheduleLead._id
                        ? { ...l, scheduledDate }
                        : l
                )
            );

            setShowSchedulePopup(false);
            setScheduleData({ date: "", time: "" });

        } catch (err) {
            console.error(err);
        }
    };
    const updateType = async (type) => {
        try {
            await API.put(`/api/leads/update-type/${selectedLead._id}`, {
                type
            });


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
    const filteredLeads = leads.filter((lead) =>
        (lead.name || "").toLowerCase().includes(search.toLowerCase())
    );
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
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="leadcards">


                    {filteredLeads.length === 0 ? (
                        <p style={{ margin: "20px" }}>No matching leads</p>
                    ) : (
                        filteredLeads.map((lead) => (
                            <div className="lc" key={lead._id}>
                                <div className="info">
                                    <div className={`imp ${lead.type}`}>
                                        <h1>{lead.name}</h1>
                                        <p>{lead.email}</p>
                                    </div>
                                    <div>
                                        <img src="/images/calendar.png" alt="" />
                                        <h3>
                                            {new Date(lead.assignedDate).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric"
                                            })}
                                        </h3>
                                    </div>
                                </div>

                                <div className="buttons">
                                    <div className={`ring ${lead.type}`}>
                                        <span className="text">{lead.status}</span>
                                    </div>

                                    <div className='dummy'>
                                        <div
                                            className={`lcbtn ${lead.status === "closed" ? "disabled" : ""}`}
                                            onClick={(e) => {
                                                if (lead.status === "closed") return;
                                                setSelectedLead(lead);
                                                setShowPopup(true);
                                                setPopupPos({ x: e.clientX, y: e.clientY });
                                            }}
                                        >
                                            <img src="/images/lc1.png" alt="" />
                                        </div>

                                        <div
                                            className={`lcbtn ${lead.status === "closed" ? "disabled" : ""}`}
                                            onClick={(e) => {
                                                if (lead.status === "closed") return;

                                                const rect = e.currentTarget.getBoundingClientRect();

                                                setScheduleLead(lead);
                                                setShowSchedulePopup(true);

                                                setPopupPos({
                                                    x: rect.left,
                                                    y: rect.bottom
                                                });
                                            }}
                                        >
                                            <img src="/images/lc2.png" alt="" />
                                        </div>

                                        <div
                                            className={`lcbtn ${lead.status === "closed" ? "disabled" : ""}`}
                                            onClick={(e) => {
                                                if (lead.status === "closed") return;

                                                const rect = e.target.getBoundingClientRect();

                                                setStatusLead(lead);
                                                setShowStatusPopup(true);
                                                setStatus(lead.status);

                                                setPopupPos({
                                                    x: rect.left,
                                                    y: rect.bottom
                                                });
                                            }}
                                        >
                                            <img src="/images/lc3.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
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

            {showSchedulePopup && (
                <>
                    {/* Overlay */}
                    <div
                        className="overlay"
                        onClick={() => setShowSchedulePopup(false)}
                    ></div>

                    {/* Popup */}
                    <div
                        className="schedule-popup"
                        style={{
                            position: "absolute",
                            top: popupPos.y - 10,
                            left: popupPos.x - 150,
                            zIndex: 20
                        }}
                    >
                        <h3>Date</h3>

                        <input
                            type="date"
                            value={scheduleData.date}
                            onChange={(e) =>
                                setScheduleData({ ...scheduleData, date: e.target.value })
                            }
                        />
                        <h3>Time</h3>
                        <input
                            type="time"
                            value={scheduleData.time}
                            onChange={(e) =>
                                setScheduleData({ ...scheduleData, time: e.target.value })
                            }
                        />

                        <button onClick={saveSchedule}>Save</button>
                    </div>
                </>
            )}
            {showStatusPopup && (
                <>
                    {/* Overlay */}
                    <div
                        className="overlay"
                        onClick={() => {
                            setShowStatusPopup(false);
                            setShowInfoPopup(false);
                        }}
                    ></div>

                    {/* Main Popup */}
                    <div
                        className="status-popup"
                        style={{
                            position: "absolute",
                            top: popupPos.y,
                            left: popupPos.x - 230,
                            zIndex: 20
                        }}
                    >
                        <div className='heading'>
                            <h3>Lead Status</h3>
                            <button
                                className="info-btn"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    const rect = e.target.getBoundingClientRect();

                                    setInfoPos({
                                        x: rect.right,
                                        y: rect.top
                                    });

                                    setShowInfoPopup(true);
                                }}
                            >
                                <img src="/images/info.png" alt="" />
                            </button>
                        </div>
                        <div className="status-row">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="ongoing">Ongoing</option>
                                <option value="closed">Closed</option>
                            </select>



                        </div>

                        <button className='save' onClick={updateStatus}>Save</button>
                    </div>

                    {/* ℹ️ Info Popup (separate) */}
                    {showInfoPopup && (
                        <div
                            className="info-popup"
                            style={{
                                position: "absolute",
                                top: infoPos.y - 70,
                                left: infoPos.x - 200,
                                zIndex: 30
                            }}
                        >
                            <p>Lead can not be closed if scheduled</p>

                        </div>
                    )}
                </>
            )}
        </div>

    )

}

export default Empleads;