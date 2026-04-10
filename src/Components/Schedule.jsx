import React from 'react'
import Empnav from "./Empnav.jsx";
import API from "../api.js";
import './Schedule.css'
import { useEffect, useState } from "react";

const Schedule = () => {
    const [search, setSearch] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showStatusPopup, setShowStatusPopup] = useState(false);
    const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

    const fetchSchedules = async (searchTerm = "") => {
        setLoading(true);
        try {
            const employeeId = localStorage.getItem("employeeId");

            const res = await API.get("/api/leads/my-schedules", {
                params: {
                    employeeId,
                    search: searchTerm
                }
            });

            setSchedules(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules("");
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchSchedules(search);
        }, 400);

        return () => clearTimeout(delay);
    }, [search]);
    return (
        <div>
            <div className="schheading">
                <div>
                    <h3>Canvo</h3>
                    <p>CRM</p>
                </div>
                <div>
                    <h1> &lt; Schedule</h1>
                </div>
            </div>
            <div className="schmain">
                <div className="firstline">
                    <div className="schsearch">
                        <img src="/images/search.png" alt="" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <img src="images/filter2.png" onClick={(e) => {


                        const rect = e.target.getBoundingClientRect();
                        setShowStatusPopup(true);
                        setPopupPos({
                            x: rect.left,
                            y: rect.bottom
                        });
                    }} alt="" />
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : schedules.length === 0 ? (
                    <p>No schedules found</p>
                ) : (
                    schedules.map((item, index) => (
                        <div
                            className={`schcard ${index === 0 ? "active" : ""}`}
                            key={item._id}
                        >
                            <div className="schleft">
                                <h3>{item.source}</h3>
                                <p>{item._id}</p>

                                <div className='schsub'>
                                    <img src="/images/location.png" alt="" />
                                    <p>{item.location}</p>
                                </div>

                                <p className='schname'> {item.name}</p>
                            </div>

                            <div className="schright">
                                <h3>Date</h3>
                                <p>{new Date(item.scheduledDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Empnav></Empnav>
            {showStatusPopup && (
                <>

                    <div
                        className="overlay"
                        onClick={() => {
                            setShowStatusPopup(false);

                        }}
                    ></div>

                    <div
                        className="schstatus-popup"
                        style={{
                            position: "absolute",
                            top: popupPos.y - 20,
                            left: popupPos.x - 150,
                            zIndex: 20
                        }}
                    >
                        <div>
                            <h3>Filter</h3>
                            <select>
                                <option >Today</option>
                                <option >All</option>
                            </select>
                        </div>

                        <button className='save' >Save</button>
                    </div>


                </>
            )}
        </div>
    )
}

export default Schedule;