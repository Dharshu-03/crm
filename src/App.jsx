import Setting from './Components/Settings';
import Employee from './Components/Employee';
import Lead from './Components/Lead';
import Dashboard from './Components/Dashboard';
import Emplogin from './Components/Emplogin';
import Empsettings from './Components/Empsettings';
import Emphome from './Components/Emphome';
import Schedule from './Components/Schedule';
// import Empleads from './Components/Empleads';
import ProtectedRoute from "./Components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>

        {/* ── Admin routes (no protection) ── */}
        <Route path="/settings" element={<Setting />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/lead" element={<Lead />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ── Employee public route ── */}
        <Route path="/login" element={<Emplogin />} />

        {/* ── Employee protected routes ── */}
        <Route path="/empsettings" element={<ProtectedRoute><Empsettings /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Emphome /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
        {/* <Route path="/empleads" element={<ProtectedRoute><Empleads /></ProtectedRoute>} /> */}

      </Routes>
    </Router>
  );
}

export default App;