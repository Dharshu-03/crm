import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from './Navbar.jsx'
import './dashboard.css'
import { useEffect } from "react";
import { useRef } from 'react';
import API from "../api.js";

const Dashboard = () => {

    const [search, setSearch] = useState("");
    const [showTypePopup, setShowTypePopup] = useState(false);
    const [email, setEmail] = useState("");
    const [fname, setfname] = useState("");
    const [lname, setlname] = useState("");
    const [location, setlocation] = useState("");
    const [language, setlanguage] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [employee, setEmployee] = useState([]);
    const [ellipsisOpenId, setEllipsisOpenId] = useState(null);
    const ellipsisRef = useRef(null);
    const [deleteAll, setDelelteAll] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);

    const [employees, setEmployees] = useState([]);
    const [kpi, setKpi] = useState({
        unassignedLeads: 0,
        assignedThisWeek: 0,
        activeSalesPeople: 0,
        conversionRate: 0
    });

    useEffect(() => {
        fetchKPI();
    }, []);

    const fetchKPI = async () => {
        try {
            const res = await API.get("/api/employees/dashboard/kpi");
            setKpi(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchActiveEmployees();
    }, []);

    const fetchActiveEmployees = async () => {
        try {
            const res = await API.get("/api/employees/active");
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
    };




    const highlightMatch = (text, query) => {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query.trim()})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part)
                ? <mark key={i} style={{ backgroundColor: "#FFF176", borderRadius: "3px", padding: "0 2px" }}>{part}</mark>
                : part
        );
    };






    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        if (isNaN(d)) return "-";
        return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`;
    };
    return (
        <>
            <div className='dashboard'>
                <Nav />
                <div className='dashmain'>
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
                    <div className="dashbeforetab">
                        <h3>Home   &gt;   Dashboard</h3>

                    </div>
                    <div className='dashtab'>

                        <div className="stats">
                            <div className="innerstat">
                                <img src="/images/s1.png" alt="" />
                                <div><p>Unassigned Leads</p>
                                    <h4>{kpi.unassignedLeads}</h4></div>
                            </div>
                            <div className="innerstat">
                                <img src="/images/s2.png" alt="" />
                                <div><p>Assigned This Week</p>
                                    <h4>{kpi.assignedThisWeek}</h4></div>
                            </div>
                            <div className="innerstat">
                                <img src="/images/s3.png" alt="" />
                                <div><p>Active Salsepeople</p>
                                    <h4>{kpi.activeSalesPeople}</h4></div>
                            </div>
                            <div className="innerstat">
                                <img src="/images/s4.png" alt="" />
                                <div><p>Conversion Rate</p>
                                    <h4>{kpi.conversionRate}%</h4></div>
                            </div>

                        </div>
                        <div className="mid">
                            <div className="graph"></div>
                            <div className="recent"></div>
                        </div>

                        <div className="dashbox">
                            {loading ? (
                                <p style={{ padding: "20px", color: "#888" }}>Loading...</p>
                            ) : (

                                <div className="dashboard-table-container">
                                    <table className="dashboard-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Employee ID</th>
                                                <th>Assigned Leads</th>
                                                <th>Closed Leads</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {employees.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: "center" }}>
                                                        No Active Employees
                                                    </td>
                                                </tr>
                                            ) : (
                                                employees.map(emp => (
                                                    <tr key={emp._id}>
                                                        <td>{emp.fname} {emp.lname}</td>
                                                        <td>{emp._id}</td>
                                                        <td>{emp.ongoingLeads}</td>
                                                        <td>{emp.closedLeads}</td>
                                                        <td >
                                                            <li className="status-active">{emp.status}</li></td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </div>







                    </div>
                </div >

            </div >
        </>
    )
}


export default Dashboard;