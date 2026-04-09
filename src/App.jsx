import Setting from './Components/Settings';
import Employee from './Components/Employee';
import Lead from './Components/Lead';
import Dashboard from './Components/Dashboard';
import Emplogin from './Components/Emplogin';
import Empsettings from './Components/Empsettings';
import Emphome from './Components/Emphome';
import Schedule from './Components/Schedule';
import Empleads from './Components/Empleads';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";


function App() {
  return (
    <>
      <Router>
        <Routes>

          <Route path="/settings" element={<Setting />} />
          <Route path="/employee" element={<Employee />}></Route>
          <Route path="/lead" element={<Lead />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/login" element={<Emplogin />}></Route>
          <Route path="/empsettings" element={<Empsettings />}></Route>
          <Route path="/home" element={<Emphome />}></Route>
          <Route path="/schedule" element={<Schedule />}></Route>
          <Route path="/empleads" element={<Empleads />}></Route>
        </Routes >
      </Router >
    </>
  );
}

export default App;
