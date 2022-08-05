import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from '../../layout/Navbar'
import axios from "axios";


const pages = ['Home', 'View Records', 'View Doctors'];
const links = ['/patient/home', '/patient/view/record', '/patient/view/doctor'];

const ViewRecord = () => {
  const [users, setUser] = useState([]);

  

  useEffect(() => {
    loadUsers();
  }, []);
  const loadUsers = async () => {
    const result = await axios.get("http://localhost:3003/users");
    setUser(result.data);
  };
  return (
    <div>
      <Navbar pages={pages} links={links}></Navbar>
      <div className="container-sm">
        <div className="py-4">
          <h1>View Record Page</h1>
        </div>
        <table className="table border shadow">
          <thead className="table-dark">
            <tr>
              <th scope="col"> DIAGNOSIS</th>
              <th scope="col">DATE</th>
              <th scope="col">EXAMINED BY</th>
              <th scope="col">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Link
                    className="btn btn-primary m-1"
                    to="/patient/view/viewdetails"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewRecord;
