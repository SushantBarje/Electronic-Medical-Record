import React, {useState, useEffect} from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import Navbar from './components/layout/Navbar'
import Home from "./components/patient/pages/Home";
import ViewRecord from "./components/patient/pages/ViewRecord";
import ViewDoctor from "./components/patient/pages/ViewDoctor";
import ViewDetails from "./components/patient/users/ViewDetails";
import NotFound from "./components/patient/pages/NotFound";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login/Login";

import LayoutOutlet from "./components/LayoutOutlet/LayoutOutlet";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import Unauthorized from "./components/Unauthorized/Unauthorized";

function App() {

  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<LayoutOutlet />}>
            
            {/* Unprotected Routes */}
            <Route exact path="/" element={<Login />}></Route>
            <Route exact path="/unauthorized" element={<Unauthorized/>}/>
            
            {/* Protected Routes */}
            {/* Doctor Routes */}
            <Route element={<RequireAuth allowedRole={"doctor"}/>}>

            </Route>

            {/*Laboratory Routes */}
            <Route element={<RequireAuth allowedRole={"laboratory"}/>}>
            
            </Route>

            {/*Patient Routes */}
            <Route element={<RequireAuth allowedRole={"patient"}/>}>
              <Route exact path="/patient/home" element={<Home />}></Route>
              <Route exact path="/patient/view/record" element={<ViewRecord />}></Route>
              <Route exact path="/patient/view/doctor" element={<ViewDoctor />}></Route>
              <Route exact path="/patient/view/viewdetails" element={<ViewDetails />}></Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
    </div>
  );
}

export default App;
