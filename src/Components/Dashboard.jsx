import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from './Navbar.jsx'
import './dashboard.css'
import { useEffect } from "react";
import { useRef } from 'react';
import API from "../api.js";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
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


    const ConversionGraph = () => {
        const chartRef = useRef(null);
        const chartInstance = useRef(null);
        const [trendData, setTrendData] = useState([]);

        useEffect(() => {
            API.get("/api/employees/dashboard/conversion-trend")
                .then(res => setTrendData(res.data))
                .catch(console.error);
        }, []);

        useEffect(() => {
            if (!trendData.length || !chartRef.current) return;
            if (chartInstance.current) chartInstance.current.destroy();

            const labels = trendData.map(d => {
                const date = new Date(d.date);
                return date.toLocaleDateString("en-US", { weekday: "short" });
            });

            chartInstance.current = new Chart(chartRef.current, {
                type: "bar",
                data: {
                    labels,
                    datasets: [{
                        label: "Conversion Rate (%)",
                        data: trendData.map(d => d.rate),
                        borderColor: "#4f46e5",
                        backgroundColor: "rgba(79,70,229,0.08)",
                        pointBackgroundColor: "#4f46e5",
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 60,
                            ticks: { callback: v => v + "%" }
                        },
                        x: {
                            ticks: { autoSkip: false },
                            grid: {
                                display: false   // ✅ removes vertical lines
                            }
                        }
                    }
                }
            });

            return () => chartInstance.current?.destroy();
        }, [trendData]);

        return (
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <canvas ref={chartRef}></canvas>
            </div>
        );
    };

    const RecentActivity = () => {
        const [activities, setActivities] = useState([]);

        useEffect(() => {
            API.get("/api/employees/dashboard/recent-activity")
                .then(res => setActivities(res.data))
                .catch(console.error);
        }, []);

        const iconMap = {
            lead_assigned: { icon: "👤", color: "#4f46e5" },
            lead_status_updated: { icon: "🔄", color: "#0891b2" },
            employee_created: { icon: "✅", color: "#16a34a" },
        };

        const timeAgo = (dateStr) => {
            const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
            if (diff < 60) return `${diff}s ago`;
            if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
            if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
            return `${Math.floor(diff / 86400)}d ago`;
        };

        return (
            <div className="recent-feed">
                <p className="recent-title">Recent Activity Feed</p>
                <div className="recent-scroll">
                    {activities.length === 0 ? (
                        <p className="recent-empty">No recent activity</p>
                    ) : (

                        <div className="activity-list">
                            {[...activities]
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
                                .slice(0, 7)
                                .map((act) => (
                                    <div className="activity-item" key={act._id}>
                                        <li className="activity-msg">{act.message}-{timeAgo(act.createdAt)}</li>

                                        <p className="activity-time"></p>
                                    </div>
                                ))}
                        </div>


                    )}
                </div>
            </div>
        );
    };
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
                            <div className="graph">
                                <h1>Sale Analytics</h1>
                                <div><ConversionGraph /></div>

                            </div>
                            <div className="recent">
                                <RecentActivity />
                            </div>
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