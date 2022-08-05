import './App.css';

import {Routes, Route} from 'react-router-dom';

import Login from './components/Login/Login';

import DoctorAdminLayout from './components/Admin/DoctorAdmin/DoctorAdminLayout';
import DoctorAdminHome from './components/Admin/DoctorAdmin/DoctorAdminHome/DoctorAdminHome';
import AddPatient from './components/Admin/DoctorAdmin/AddPatient/AddPatient';
import AddDoctor from './components/Admin/DoctorAdmin/AddDoctor/AddDoctor';
import ViewDoctor from './components/Admin/DoctorAdmin/ViewDoctor/ViewDoctor';

import LaboratoryAdminLayout from './components/Admin/LaboratoryAdminLayout/LaboratoryAdminLayout'
import LaboratoryAdminHome from './components/Admin/LaboratoryAdminLayout/LaboratoryAdminHome/LaboratoryAdminHome';

import PatientLayout from './components/Patient/PatientLayout';
import PatientHome from './components/Patient/PatientHome/PatientHome';
import ViewDoctors from './components/Patient/ViewDoctors/ViewDoctors';
import ViewRecords from './components/Patient/ViewRecords/ViewRecords';
import ViewRecord from './components/Patient/ViewRecord/ViewRecord';

import DoctorLayout from './components/Doctor/Doctor/DoctorLayout';
import DoctorHome from './components/Doctor/Doctor/DoctorHome/DoctorHome';
import ViewPatients from './components/Doctor/Doctor/ViewPatients/ViewPatients';
import ViewPatient from './components/Doctor/Doctor/ViewPatient/ViewPatient';
import AddRecord from './components/Doctor/Doctor/AddRecord/AddRecord';
import ViewHistory from './components/Doctor/Doctor/ViewHistory/ViewHistory';

import LaboratoryLayout from './components/Doctor/Laboratory/LaboratoryLayout';
import LaboratoryHome from './components/Doctor/Laboratory/LaboratoryHome/LaboratoryHome';

import RequireAuth from "./components/RequireAuth/RequireAuth";
import Unauthorized from "./components/Unauthorized/Unauthorized";
import NotFound from './components/NotFound/NotFound';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login></Login>}></Route>
      
        {/* Admin Routes */}

          {/* Doctor Admin Routes */}
          <Route element={<RequireAuth allowedRole={"admin"}/>}>
            <Route path="/admin/doctor" element={<DoctorAdminLayout></DoctorAdminLayout>}>
              <Route index element={<DoctorAdminHome></DoctorAdminHome>}></Route>
              <Route path="add/patient" element={<AddPatient></AddPatient>}/>
              <Route path="add/doctor" element={<AddDoctor></AddDoctor>}/>
              <Route path="view/doctors" element={<ViewDoctor></ViewDoctor>}></Route>
            </Route>
          </Route>
          


          {/* Laboratory Admin Routes */}
          <Route element={<RequireAuth allowedRole={"admin"}/>}>
            <Route path="/admin/lab" element={<LaboratoryAdminLayout></LaboratoryAdminLayout>}>
              <Route index element={<LaboratoryAdminHome></LaboratoryAdminHome>}></Route>
              <Route path="add/doctor" element={<AddDoctor></AddDoctor>}></Route>
              <Route path="view/doctors" element={<ViewDoctor></ViewDoctor>}></Route>
            </Route>
          </Route>
          
        
        {/* Doctors Routes */}

          {/* Doctor Deptartment Routes */}
          <Route element={<RequireAuth allowedRole={"doctor"}/>}>
            <Route path="/doctor" element={<DoctorLayout></DoctorLayout>}>
              <Route index element={<DoctorHome></DoctorHome>}></Route>
              <Route path="view/patients" element={<ViewPatients></ViewPatients>}></Route>
              {/* <Route path="view/patient">
                <Route path=":patientId" element={ViewPatient}></Route>
              </Route> */}
              <Route path="view/patient/:patientId" element={<ViewPatient></ViewPatient>}></Route>
              <Route path="view/patient/:patientId/add" element={<AddRecord></AddRecord>}></Route>
              <Route path="view/patient/:patientId/history" element={<ViewHistory></ViewHistory>}></Route>
            </Route>
          </Route>
          

          {/* Laboratory Department Routes */}
          <Route element={<RequireAuth allowedRole={"doctor"}/>}>
            <Route path="/laboratory" element={<LaboratoryLayout></LaboratoryLayout>}>
              <Route index element={<LaboratoryHome></LaboratoryHome>}></Route>
              <Route path="view/patients" element={<ViewPatient></ViewPatient>}></Route>
              {/* <Route path="view/patient/:patientId/add" element={<AddReport></AddReport>}></Route> */}
            </Route> 
          </Route>
                          

        {/* Patient Routes */}
        <Route element={<RequireAuth allowedRole={"patient"}/>}>
          <Route path="/patient" element={<PatientLayout></PatientLayout>}>
            <Route index element={<PatientHome></PatientHome>}></Route>
            <Route path="view/doctors" element={<ViewDoctors></ViewDoctors>}></Route>
            <Route path="view/records" element={<ViewRecords></ViewRecords>}>
              <Route path=":recordId" element={<ViewRecord></ViewRecord>}></Route>
            </Route>
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
        <Route exact path="/unauthorized" element={<Unauthorized/>}/>
      </Routes>
    </div>
  );
}

export default App;
