import React from "react";
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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route
            exact
            path="/patient/view/record"
            element={<ViewRecord />}
          ></Route>
          <Route
            exact
            path="/patient/view/doctor"
            element={<ViewDoctor />}
          ></Route>
          <Route
            exact
            path="/patient/view/viewdetails"
            element={<ViewDetails />}
          ></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
