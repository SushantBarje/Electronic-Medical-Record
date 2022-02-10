
//import { Container,  } from '@mui/material';
//import './App.css';
//import Header from './components/Header';
//import FeaturedPost from "./components/FeaturedPost";
//import PostCard from "./components/PostCard";
//import { featuredPosts, sidebar } from "./Data/Data";
//import Main from "./components/Main";
//import Sidebar from "./components/Sidebar";
//import Footer from "./components/Footer";
//import AdminDashboard from './components/AdminDashboard/AdminDashboard';
//import Header from './components/Header/Header';
//import Login from './components/Login/Login';
//import {BrowserRouter,Routes, Route, Link} from 'react-router-dom';

/* Doctor Dashboard...

import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;*/
import React from "react";
import {  Route, } from "react-router-dom";
import ForgetPass from "./components/Login/forgetpass";
import SignIn from "./components/Login/signin.js";
import Register from "./components/Login/register.js";
import "./styles.css";

export default function App() {
  return (
    <div>
      <Route path="">
        <SignIn />
      </Route>
      <Route path="/forget">
        <ForgetPass />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
    </div>
  );
}



