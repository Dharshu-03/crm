import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from './Navbar.jsx'
import './Lead.css'
import API from "../api";
import { useEffect } from "react";
const Lead = () => {
    const navigate = useNavigate();
    // const [stats, setStats] = useState({
    //     categories: 0,
    //     totalProducts: 0,
    //     totalAmount: 0,
    //     topSellingCount: 0,
    //     topSellingAmount: 0,
    //     lowStockCount: 0,
    //     lowStockAmount: 0,
    // });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setname] = useState("");
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [date, setdate] = useState("");
    const [srcs, setsources] = useState("");
    const [location, setlocation] = useState("");
    const [language, setlanguage] = useState("");
    const [showTypePopup, setShowTypePopup] = useState(false);
    const [leads, setLeads] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/api/leads/add", {
                name,
                email,
                date,
                source: srcs,
                location,
                language
            });

            alert("Lead added successfully");

            setname("");
            setEmail("");
            setdate("");
            setsources("");
            setlocation("");
            setlanguage("");

        } catch (err) {
            console.error(err);
            alert("Failed to add lead");
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

    const fetchLeads = async (pageNum = 1, searchTerm = "") => {
        setLoading(true);
        try {
            console.log("hello");
            const res = await API.get(`/api/leads`, {
                params: { page: pageNum, search: searchTerm }
            });
            setLeads(res.data.leads);
            setTotalPages(res.data.totalPages);
            setPage(res.data.page);
            console.log(leads);
            console.log(leads.length);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads(1, "");
    }, []);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        if (isNaN(d)) return "-";
        return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`;
    };

    return (
        <>
            <div className='leads'>
                <Nav />
                <div className='leadmain'>
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
                    <div className="leadbeforetab">
                        <h3>Home   &gt;   Leads</h3>
                        <div>
                            <button className='add' onClick={() => setShowTypePopup(true)}>Add Manually</button>
                            <button className='add'>Add CSV</button>
                        </div>
                    </div>
                    <div className='leadtab'>


                        {loading ? (
                            <p style={{ padding: "20px", color: "#888" }}>Loading...</p>
                        ) : (

                            <table className="leads-table">
                                <thead>
                                    <tr>

                                        <th>No.</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Source</th>
                                        <th>Date</th>
                                        <th>Location</th>
                                        <th>Language</th>
                                        <th>Assigned To</th>
                                        <th>Status</th>
                                        <th>Type</th>
                                        <th>Scheduled  Date</th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.length === 0 ? (
                                        <tr>
                                            <td colSpan="11" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                                                {search ? `No products found for "${search}"` : "No leads found"}
                                            </td>
                                        </tr>
                                    ) : (
                                        leads.map((lead, index) => (
                                            <tr key={lead._id}>
                                                <td>{index + 1}</td>
                                                <td>{highlightMatch(lead.name, search)}</td>
                                                <td>{lead.email}</td>
                                                <td>{lead.source}</td>
                                                <td>{formatDate(lead.date)}</td>
                                                <td>{lead.location}</td>
                                                <td>{lead.language}</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                        )}

                        {/* {!search && ( */}
                        <div className="pagination">
                            <div onClick={() => fetchLeads(page - 1, "")} disabled={page <= 1}>
                                <img src="/images/pre.png" alt="" />
                                Previous
                            </div>
                            <span>Page {page} of {totalPages}</span>
                            <div onClick={() => fetchLeads(page + 1, "")} disabled={page >= totalPages}>

                                Next
                                <img src="/images/next.png" alt="" />
                            </div>
                        </div>
                        {/* )} */}

                        {showTypePopup && (
                            <div className="popup-overlay" onClick={() => setShowTypePopup(false)}>
                                <div className="popup" onClick={(e) => e.stopPropagation()}>
                                    <div className='popupheading'>
                                        <h3>Add new Lead</h3>
                                        <img onClick={() => setShowTypePopup(false)} src="/images/close.png" alt="" />
                                    </div>
                                    <form onSubmit={handleSubmit} action="">
                                        <div className="input-group"><label>Name</label><input type='text' value={name} onChange={e => setname(e.target.value)} /></div>
                                        <div className="input-group"><label>Email</label><input type='email' value={email} onChange={e => setEmail(e.target.value)} /></div>
                                        <div className="input-group"><label>Source</label><input value={srcs} onChange={e => setsources(e.target.value)} /></div>
                                        <div className="input-group"><label>Date</label><input type='date' value={date} onChange={e => setdate(e.target.value)} /></div>
                                        <div className="input-group"><label>Location</label><input value={location} onChange={e => setlocation(e.target.value)} /></div>
                                        <div className="input-group"><label>Preferred Language</label><input value={language} onChange={e => setlanguage(e.target.value)} /></div>
                                        <button className='save' type="submit">Save</button>
                                    </form>

                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </>
    )
}
export default Lead;