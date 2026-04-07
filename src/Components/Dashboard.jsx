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
                                    <h4>5</h4></div>
                            </div>
                            <div className="innerstat">
                                <img src="/images/s2.png" alt="" />
                                <div><p>Assigned This Week</p>
                                    <h4>5</h4></div>
                            </div>
                            <div className="innerstat">
                                <img src="/images/s3.png" alt="" />
                                <div><p>Active Salsepeople</p>
                                    <h4>5</h4></div>
                            </div>
                            <div className="innerstat">
                                <img src="/images/s4.png" alt="" />
                                <div><p>Conversion Rate</p>
                                    <h4>5</h4></div>
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

                                <table className="employees-table">
                                    <thead>
                                        <tr>


                                            <th>Name</th>
                                            <th>Employee ID</th>
                                            <th>Assigned Leads</th>
                                            <th>Closed Leads</th>
                                            <th>status</th>



                                        </tr>
                                    </thead>
                                    {/* <tbody>
                                        {employee.length === 0 ? (
                                            <tr>
                                                <td colSpan="11" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                                                    {search ? `No products found for "${search}"` : "No Employees found"}
                                                </td>
                                            </tr>
                                        ) : (
                                            employee.map((employee, index) => (
                                                <tr key={employee._id}>
                                                    <td>
                                                        <input type="checkbox" checked={deleteAll} readOnly />
                                                    </td>
                                                    <td>{highlightMatch(employee.fname, search)}  {employee.lname}</td>
                                                    <td > <p className="empid">{employee._id}</p></td>
                                                    <td>{employee.ongoingLeads || 0}</td>
                                                    <td>{employee.closedLeads || 0}</td>
                                                    <td>-  <div style={{ position: "relative" }} ref={ellipsisOpenId === employee._id ? ellipsisRef : null}>
                                                        <button
                                                            className="ellipsis-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (ellipsisOpenId === employee._id) {
                                                                    setEllipsisOpenId(null);

                                                                } else {
                                                                    setEllipsisOpenId(employee._id);

                                                                }
                                                            }}
                                                        >⋮</button>



                                                       
                                                        {ellipsisOpenId === employee._id && (
                                                            <div className="ellipsis-popup" onClick={(e) => e.stopPropagation()}>
                                                                <div className="invoicepop">

                                                                    <button
                                                                        className="ellipsis-action-btn"
                                                                        onClick={() => {
                                                                            setEllipsisOpenId(null); // close ellipsis
                                                                            setEditEmployee(employee); // store selected employee
                                                                            setfname(employee.fname);
                                                                            setlname(employee.lname);
                                                                            setEmail(employee.email);
                                                                            setlocation(employee.location);
                                                                            setlanguage(employee.language);
                                                                            setShowEditPopup(true); // open edit popup
                                                                        }}
                                                                    >
                                                                        <img src="/images/edit.png" alt="" />
                                                                        <p>Edit</p>
                                                                    </button>
                                                                </div>
                                                                <div className="invoicepop">

                                                                    <button
                                                                        className="ellipsis-action-btn"
                                                                        onClick={() => handleDelete(employee._id)}
                                                                    >
                                                                        <img src="/images/delete.png" alt="" />
                                                                        <p>Delete</p>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div></td>

                                                </tr>
                                            ))
                                           
                                        )}
                                    </tbody> */}
                                </table>

                            )}

                        </div>







                    </div>
                </div >

            </div >
        </>
    )
}


export default Dashboard;