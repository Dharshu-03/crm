import Setting from './Components/Settings';
import Employee from './Components/Employee';
import Lead from './Components/Lead';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <Routes>

          <Route path="/settings" element={<Setting />} />
          <Route path="/employee" element={<Employee />}></Route>
          <Route path="/lead" element={<Lead />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
