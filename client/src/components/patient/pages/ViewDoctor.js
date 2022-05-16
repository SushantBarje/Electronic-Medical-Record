import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
const ViewDoctor = () => {
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
      <div className="container-sm">
        <div className="py-4">
          <h1>View Doctor Page</h1>
        </div>
        <table className="table border shadow">
          <thead className="table-dark">
            <tr>
              <th scope="col">Doctor Id</th>
              <th scope="col">Doctor Name</th>
              <th scope="col">Department</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Link className="btn btn-primary m-1"  to="#">Grant</Link>
                  <Link className="btn btn-danger m-2" to="#">Revoke</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewDoctor;
