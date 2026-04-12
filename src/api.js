import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");  // ✅ consistent key
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const path = window.location.pathname;
            const employeeRoutes = ["/home", "/empsettings", "/schedule", "/empleads"];
            const isEmployeeRoute = employeeRoutes.some(r => path.startsWith(r));

            if (isEmployeeRoute) {
                localStorage.removeItem("token");
                localStorage.removeItem("employeeId");
                localStorage.removeItem("employeeName");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default API;