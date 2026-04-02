import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from './Navbar.jsx'
import './Lead.css'
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
    // const [page, setPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);
    // const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setname] = useState("");
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [date, setdate] = useState("");
    const [srcs, setsources] = useState("");
    const [location, setlocation] = useState("");
    const [language, setlanguage] = useState("");
    const [showTypePopup, setShowTypePopup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("date", date);
            formData.append("source", srcs);
            formData.append("location", location);
            formData.append("language", language);


            // await API.post("/api/products/add", formData, {
            //     headers: { "Content-Type": "multipart/form-data" }
            // });

            alert("Lead added successfully");
            setname("");
            setEmail("");
            setdate("");
            setsources("");
            setlocation("");
            setlanguage("");

        } catch (err) {
            console.error(err);
            alert("Failed to add employee");
        }
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
                        <h3>Home   &gt;   Settings</h3>
                        <div>
                            <button className='add' onClick={() => setShowTypePopup(true)}>Add Manually</button>
                            <button className='add'>Add CSV</button>
                        </div>
                    </div>
                    <div className='leadtab'>

                        {/* 
                        {loading ? (
                            <p style={{ padding: "20px", color: "#888" }}>Loading...</p>
                        ) : (

                            <table className="product-table">
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
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                                                {search ? `No products found for "${search}"` : "No products found"}
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product) => {
                                            const availability = getAvailability(product);
                                            return (
                                                <tr key={product._id}>
                                                    <td style={{ cursor: "pointer", color: "#292929", fontWeight: 500 }}
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setBuyQuantity("");
                                                            setShowSimulatePopup(true);
                                                        }}>{highlightMatch(product.name, search)}</td>
                                                    <td>₹{product.price}</td>
                                                    <td>{product.quantity} {product.unit}</td>
                                                    <td>{product.threshold}</td>
                                                    <td>{formatDate(product.expiryDate)}</td>
                                                    <td style={{ color: availability.color, fontWeight: 500 }}>
                                                        {availability.label}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>

                        )}

                        {!search && (
                            <div className="pagination">
                                <button onClick={() => fetchProducts(page - 1, "")} disabled={page <= 1}>
                                    Previous
                                </button>
                                <span>Page {page} of {totalPages}</span>
                                <button onClick={() => fetchProducts(page + 1, "")} disabled={page >= totalPages}>
                                    Next
                                </button>
                            </div>
                        )} */}

                        {showTypePopup && (
                            <div className="popup-overlay" onClick={() => setShowTypePopup(false)}>
                                <div className="popup" onClick={(e) => e.stopPropagation()}>
                                    <div className='popupheading'>
                                        <h3>Add new Lead</h3>
                                        <img onClick={() => setShowTypePopup(false)} src="/images/close.png" alt="" />
                                    </div>
                                    <form onSubmit={handleSubmit} action="">
                                        <div className="input-group"><label>Name</label><input type='email' value={name} onChange={e => setname(e.target.value)} /></div>
                                        <div className="input-group"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
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