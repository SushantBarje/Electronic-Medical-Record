import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = ({pages, links}) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="#">
          HealthChain
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            {
              pages.map((page, index) => (
                <li className="nav-item" key={index}>
                <NavLink className="nav-link" aria-current="page" to={links[index]}>
                  {page}
                </NavLink>
              </li>
              ))
            }
            {/* <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" to="/patient/home">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/patient/view/record">
                View Record
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/patient/view/doctor">
                View Doctor
              </NavLink>
            </li> */}
          </ul>
        </div>
      </div>

     
    </nav>
  );
};

export default Navbar;
