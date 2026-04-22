import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PatientForm from "./components/PatientsForm";
import Patients from "./pages/Patients";
import Serial from "./pages/Serial";
import Doctors from "./pages/Doctors";
import Categories from "./pages/Categories";
import Accounting from "./pages/Accounting";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/accounting" element={<Accounting />} />
      <Route path="/:chamId" element={<Home />}>
        <Route path="patients" element={<Patients />} />
        <Route path="patients/form" element={<PatientForm />} />
        <Route path="patients/:patientSerialNumber" element={<Serial />} />
      </Route>
    </Routes>
  );
}

export default App;
