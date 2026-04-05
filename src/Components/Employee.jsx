import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from './Navbar.jsx'
import './Employee.css'
import { useEffect } from "react";
import API from "../api";
const Employee = () => {

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fname || !lname || !email || !location || !language) {
            alert("All fields are required");
            return;
        }
        try {
            await API.post("/api/employees/add", {
                fname,
                lname,
                email,
                location,
                language
            });

            alert("Employee added successfully");

            setfname("");
            setlname("");
            setEmail("");
            setlocation("");
            setlanguage("");

        } catch (err) {
            console.error(err);
            alert("Failed to add employee");
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

    const fetchEmployees = async (pageNum = 1, searchTerm = "") => {
        setLoading(true);
        try {
            console.log("hello");
            const res = await API.get(`/api/employees`, {
                params: { page: pageNum, search: searchTerm }
            });
            setEmployee(res.data.employees);
            setTotalPages(res.data.totalPages);
            setPage(res.data.page);
            console.log(employee);
            console.log(employee.length);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(1, "");
    }, []);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        if (isNaN(d)) return "-";
        return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`;
    };
    return (
        <>
            <div className='employees'>
                <Nav />
                <div className='empmain'>
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
                    <div className="empbeforetab">
                        <h3>Home   &gt;   Employees</h3>
                        <button onClick={() => setShowTypePopup(true)} id="addemp">Add Employees</button>
                    </div>
                    <div className='emptab'>

                        <div className="empbox">
                            {loading ? (
                                <p style={{ padding: "20px", color: "#888" }}>Loading...</p>
                            ) : (

                                <table className="employees-table">
                                    <thead>
                                        <tr>

                                            <th><input type="checkbox" /></th>
                                            <th>Name</th>
                                            <th>Employee ID</th>
                                            <th>Assigned Leads</th>
                                            <th>Closed Leads</th>
                                            <th>status</th>



                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employee.length === 0 ? (
                                            <tr>
                                                <td colSpan="11" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                                                    {search ? `No products found for "${search}"` : "No leads found"}
                                                </td>
                                            </tr>
                                        ) : (
                                            employee.map((employee, index) => (
                                                <tr key={employee._id}>
                                                    <td><input type="checkbox" /></td>
                                                    <td>{highlightMatch(employee.fname, search)}  {employee.lname}</td>
                                                    <td > <p className="empid">{employee._id}</p></td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>- <img src="/images/more.png" alt="" /></td>

                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>

                            )}

                        </div>

                        <div className="pagination">
                            <div onClick={() => fetchEmployees(page - 1, "")} disabled={page <= 1}>
                                <img src="/images/pre.png" alt="" />
                                Previous
                            </div>
                            <span>Page {page} of {totalPages}</span>
                            <div onClick={() => fetchEmployees(page + 1, "")} disabled={page >= totalPages}>

                                Next
                                <img src="/images/next.png" alt="" />
                            </div>
                        </div>
                        {
                            showTypePopup && (
                                <div className="popup-overlay-emp" onClick={() => setShowTypePopup(false)}>
                                    <div className="emppopup" onClick={(e) => e.stopPropagation()}>
                                        <div className='emppopupheading'>
                                            <h3>Add new Lead</h3>
                                            <img onClick={() => setShowTypePopup(false)} src="/images/close.png" alt="" />
                                        </div>
                                        <form onSubmit={handleSubmit} action="">
                                            <div className="input-group"><label>First Name</label><input value={fname} onChange={e => setfname(e.target.value)} /></div>
                                            <div className="input-group"><label>Last Name</label><input value={lname} onChange={e => setlname(e.target.value)} /></div>
                                            <div className="input-group"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
                                            <div className="input-group"><label>Location</label><input value={location} onChange={e => setlocation(e.target.value)} /></div>
                                            <div className="input-group"><label>Preferred Language</label><input value={language} onChange={e => setlanguage(e.target.value)} /></div>
                                            <button className='save' type="submit">Save</button>
                                        </form>

                                    </div>
                                </div>
                            )
                        }


                    </div>
                </div >

            </div >
        </>
    )
}


export default Employee;