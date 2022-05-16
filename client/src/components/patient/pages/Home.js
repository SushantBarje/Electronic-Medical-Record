import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../layout/Navbar';

const Home = () => {

  return (
    <div>
      <Navbar></Navbar>
      <div className="container">
        <div className="py-4">
          <h1>Home Page</h1>
          <form>
            <div className="mb-3">
              <label for="exampleInputUserName" className="form-label">
                User Name
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputUserName"
              />
            </div>
            <div className="mb-3">
              <label for="exampleInputUserFullName" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputUserFullName"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
