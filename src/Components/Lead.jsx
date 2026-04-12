import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from './Navbar.jsx'
import './Lead.css'
import API from "../api";
import { useState, useEffect, useRef } from "react";
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
    const [showCsvPopup, setShowCsvPopup] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [csvUploading, setCsvUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadDone, setUploadDone] = useState(false);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const abortControllerRef = useRef(null);

    const capitalize = (text) => {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/api/leads/add", {
                name,
                email,
                date,
                source: srcs,
                location,
                language: capitalize(language)
            });

            alert("Lead added successfully");
            fetchLeads(1, "");
            setShowTypePopup(false);

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


    const getPagination = () => {
        const pages = [];

        if (totalPages <= 7) {

            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {

            pages.push(1, 2, 3);


            if (page > 4) {
                pages.push("...");
            }


            if (page > 3 && page < totalPages - 2) {
                pages.push(page);
            }


            if (page < totalPages - 3) {
                pages.push("...");
            }

            pages.push(totalPages - 2, totalPages - 1, totalPages);
        }

        return pages;
    };

    const fetchLeads = async (pageNum = 1, searchTerm = "") => {
        setLoading(true);
        try {
            console.log("hello");
            const res = await API.get(`/api/leads`, {
                params: { page: pageNum, search: searchTerm }
            });
            setLeads(Array.isArray(res.data.leads) ? res.data.leads : []);
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
    const handleCsvChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            console.log("Selected file:", file);
            setCsvFile(file);
        }
    };

    const handleCsvDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) setCsvFile(e.dataTransfer.files[0]);
    };
    useEffect(() => {
        fetchLeads(1, "");
    }, []);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        if (isNaN(d)) return "-";
        return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`;
    };

    const handleUpload = async () => {
        if (!csvFile) return;

        const formData = new FormData();
        formData.append("csv", csvFile);

        abortControllerRef.current = new AbortController();
        setCsvUploading(true);
        setUploadProgress(0);
        setUploadDone(false);

        try {
            const res = await API.post("/api/leads/upload-csv", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                signal: abortControllerRef.current.signal,
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percent);
                },
            });

            setUploadedCount(res.data.count);
            setUploadDone(true);      // show Upload button now
            setCsvUploading(false);

        } catch (err) {
            if (err.name === "CanceledError" || err.name === "AbortError") {
                // silently cancelled
            } else {
                alert(err.response?.data?.error || "Failed to upload CSV");
            }
            setCsvUploading(false);
            setUploadProgress(0);
            setUploadDone(false);
        }
    };

    const handleCancelUpload = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setCsvUploading(false);
        setUploadProgress(0);
        setUploadDone(false);
    };

    const handleConfirmUpload = () => {
        setShowCsvPopup(false);
        setCsvFile(null);
        setUploadProgress(0);
        setUploadDone(false);
        fetchLeads(1, "");
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
                            <button className='add' onClick={() => { setShowTypePopup(true); setShowCsvPopup(false); }}>Add Manually</button>
                            <button className='add' onClick={() => { setShowTypePopup(false); setShowCsvPopup(true); }}>Add CSV</button>
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
                                    {!leads || leads.length === 0 ? (
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
                                                <td>{lead.employeeId || "-"}</td>
                                                <td>{lead.status}  </td>
                                                <td>{lead.type}</td>
                                                <td>{formatDate(lead.scheduledDate)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                        )}

                        <div className="emppagination">
                            <div onClick={() => page > 1 && fetchLeads(page - 1, "")}>
                                <img src="/images/pre.png" alt="" />
                                Previous
                            </div>

                            <span>
                                {getPagination().map((p, i) =>
                                    p === "..." ? (
                                        <span key={i} className="dots">...</span>
                                    ) : (
                                        <button
                                            key={p + "-" + i}
                                            className={p === page ? "active-page" : "page"}
                                            onClick={() => fetchLeads(p, "")}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}
                            </span>
                            <div onClick={() => page < totalPages && fetchLeads(page + 1, "")}>

                                Next
                                <img src="/images/next.png" alt="" />
                            </div>
                        </div>


                        {showCsvPopup && (
                            <div
                                className="popup-overlay"
                                onClick={() => !csvUploading && !uploadDone && setShowCsvPopup(false)}
                            >
                                <div className="csvpopup" onClick={(e) => e.stopPropagation()}>

                                    {/* Header */}
                                    <div className="csvheading">
                                        <div>
                                            <h3>CSV Upload</h3>
                                            <p>Add your document here</p>
                                        </div>
                                        {!csvUploading && !uploadDone && (
                                            <img
                                                onClick={() => setShowCsvPopup(false)}
                                                src="/images/close.png"
                                                alt=""
                                            />
                                        )}
                                    </div>

                                    {/* ── Step 1: Pick file ── */}
                                    {!csvUploading && !uploadDone && (
                                        <>
                                            <div
                                                className="csv-upload-area"
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={handleCsvDrop}
                                            >
                                                <img src="/images/upload.png" alt="" />
                                                <br />
                                                <p>Drag your file(s) to start uploading</p>
                                                <p>OR</p>
                                                <input
                                                    type="file"
                                                    accept=".csv"
                                                    style={{ display: "none" }}
                                                    onChange={handleCsvChange}
                                                    id="csv-input"
                                                />
                                                <label htmlFor="csv-input" className="browse-btn">
                                                    Browse files
                                                </label>

                                                {csvFile && (
                                                    <div className="file-preview">
                                                        <div className="csvdetails">
                                                            <p className="file-name">{csvFile.name}</p>
                                                        </div>
                                                        <img src="/images/download.png" alt="" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="csv-buttons">
                                                <button
                                                    onClick={() => {
                                                        setShowCsvPopup(false);
                                                        setCsvFile(null);
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    disabled={!csvFile}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (csvFile) handleUpload();
                                                    }}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── Step 2: Uploading (progress ring) ── */}
                                    {csvUploading && (
                                        <div className="csv-loading">
                                            <div className="csv-circle-wrap">
                                                <svg viewBox="0 0 100 100" className="csv-circle-svg">
                                                    <circle
                                                        cx="50" cy="50" r="40"
                                                        fill="none"
                                                        stroke="#e0e0e0"
                                                        strokeWidth="8"
                                                    />
                                                    <circle
                                                        cx="50" cy="50" r="40"
                                                        fill="none"
                                                        stroke="#4f46e5"
                                                        strokeWidth="8"
                                                        strokeLinecap="round"
                                                        strokeDasharray={`${2 * Math.PI * 40}`}
                                                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - uploadProgress / 100)}`}
                                                        transform="rotate(-90 50 50)"
                                                        style={{ transition: "stroke-dashoffset 0.3s ease" }}
                                                    />
                                                </svg>
                                                <span className="csv-circle-percent">{uploadProgress}%</span>
                                            </div>

                                            <p className="csv-verifying-text">Verifying and uploading your file...</p>
                                            <p className="csv-file-name-small">{csvFile?.name}</p>

                                            <button className="csv-cancel-btn" onClick={handleCancelUpload}>
                                                Cancel
                                            </button>
                                        </div>
                                    )}

                                    {/* ── Step 3: Done — show Upload button to confirm and close ── */}
                                    {uploadDone && (
                                        <div className="csv-loading">
                                            <div className="csv-upload-area">
                                                <div className="csv-circle-wrap">
                                                    <svg viewBox="0 0 100 100" className="csv-circle-svg">
                                                        <circle
                                                            cx="50" cy="50" r="40"
                                                            fill="none"
                                                            stroke="#e0e0e0"
                                                            strokeWidth="8"
                                                        />
                                                        <circle
                                                            cx="50" cy="50" r="40"
                                                            fill="none"
                                                            stroke="#000"
                                                            strokeWidth="8"
                                                            strokeLinecap="round"
                                                            strokeDasharray={`${2 * Math.PI * 40}`}
                                                            strokeDashoffset="0"
                                                            transform="rotate(-90 50 50)"
                                                            style={{ transition: "stroke-dashoffset 0.3s ease" }}
                                                        />
                                                    </svg>
                                                    <span className="csv-circle-percent" style={{ color: "#000" }}>
                                                        100%
                                                    </span>
                                                </div>

                                                <p className="csv-verifying-text">
                                                    {uploadedCount} lead{uploadedCount !== 1 ? "s" : ""} ready to import
                                                </p>
                                                <p className="csv-file-name-small">{csvFile?.name}</p>
                                            </div>
                                            <div className="csv-buttons" style={{ marginTop: "8px" }}>
                                                <button onClick={handleCancelUpload}>Cancel</button>
                                                <button
                                                    style={{ background: "#000", color: "#fff" }}
                                                    onClick={handleConfirmUpload}
                                                >
                                                    Upload
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}



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