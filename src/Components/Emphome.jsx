import React from 'react'
import Empnav from "./Empnav.jsx";
import API from "../api.js";
import './Emphome.css'
import { useState, useEffect } from "react";

const Emphome = () => {



    const [breakHistory, setBreakHistory] = useState([]);
    const [attendance, setAttendance] = useState(null);
    const [employeeName, setEmployeeName] = useState("");
    const safeAttendance = attendance || {};
    const handleCheckInOut = async () => {
        const employeeId = localStorage.getItem("employeeId");

        try {
            if (!safeAttendance.checkIn) {
                await API.post("/api/attendance/check-in", { employeeId });
            } else if (!safeAttendance.checkOut) {
                await API.post("/api/attendance/check-out", { employeeId });
            }
            await fetchData();

        } catch (err) {
            alert(err.response?.data?.error);
        }
    };

    const fetchData = async () => {
        try {
            const employeeId = localStorage.getItem("employeeId");

            const res1 = await API.get(`/api/attendance/today/${employeeId}`);
            setAttendance(res1.data);

            const res2 = await API.get(`/api/attendance/break-history/${employeeId}`);
            setBreakHistory(res2.data);

            const res3 = await API.get(`/api/employees/${employeeId}`);
            setEmployeeName(res3.data.fname);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBreak = async () => {
        const employeeId = localStorage.getItem("employeeId");
        try {
            if (!safeAttendance.breakStart) {
                await API.post("/api/attendance/break-start", { employeeId });
            } else if (!safeAttendance.breakEnd) {
                await API.post("/api/attendance/break-end", { employeeId });
            }

            await fetchData();

        } catch (err) {
            alert(err.response?.data?.error);
        }
    };

    const formatTime = (date) => {
        if (!date) return "--:--";
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true   // ✅ THIS LINE
        }).toUpperCase();
    };
    const formatDate = (date) => {
        if (!date) return "--";
        return new Date(date).toLocaleDateString();
    };
    return (
        <div>
            <div className="homeheading">
                <div>
                    <h3>Canvo</h3>
                    <p>CRM</p>
                </div>
                <div>
                    <h6>Good Morning</h6>
                    <h1>{employeeName || "User"}</h1>
                </div>
            </div>
            <div className="homemain">
                <h3>Timing</h3>

                <div className="time">
                    <div>
                        <div className="checkin">
                            <h5>
                                {
                                    !safeAttendance.checkIn
                                        ? "Check In"
                                        :
                                        "Checked-In"

                                }
                            </h5>
                            <h5>{formatTime(safeAttendance.checkIn)}</h5>
                        </div>
                        <div className="checkin">
                            <h5>Check out</h5>
                            <h5>{formatTime(safeAttendance.checkOut)}</h5>
                        </div>
                    </div>
                    <button
                        className='inout'
                        onClick={handleCheckInOut}
                        disabled={safeAttendance.checkIn && safeAttendance.checkOut}
                        style={{
                            backgroundColor: !safeAttendance.checkIn
                                ? "#ccc"
                                : !safeAttendance.checkOut
                                    ? "#64E800"
                                    : "#E80000"
                        }}
                    >
                    </button>

                </div>


                <div className="break">
                    <div className="time">
                        <div>
                            <div className="checkin">
                                <h5>Break</h5>
                                <h5>{formatTime(safeAttendance.breakStart)}</h5>
                            </div>
                            <div className="checkin">
                                <h5>Ended</h5>
                                <h5>{formatTime(safeAttendance.breakEnd)}</h5>
                            </div>
                        </div>
                        <button
                            className='breakbtn'
                            onClick={handleBreak}
                            disabled={
                                !safeAttendance.checkIn ||
                                (safeAttendance.breakStart && safeAttendance.breakEnd)
                            }
                            style={{
                                backgroundColor: !safeAttendance.breakStart
                                    ? "#ccc"
                                    : !safeAttendance.breakEnd
                                        ? "#64E800"
                                        : "#E80000"
                            }}
                        >
                        </button>

                    </div>
                    <div className="pastbreaks">
                        {breakHistory.length === 0 ? (
                            <p style={{ margin: "100px " }}>No break history</p>
                        ) : (
                            breakHistory.slice(0, 4).map((item, index) => (
                                <div className="pastbreak" key={index}>
                                    <div className="first">
                                        <div>
                                            <h5>Break</h5>
                                            <h5>{formatTime(item.breakStart)}</h5>
                                        </div>
                                        <div>
                                            <h5>Ended</h5>
                                            <h5>{formatTime(item.breakEnd)}</h5>
                                        </div>
                                    </div>

                                    <div>
                                        <h5>Date</h5>
                                        <h5>{formatDate(item.date)}</h5>
                                    </div>
                                </div>
                            ))
                        )}
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