import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {Button} from 'bootstrap';

import axios from '../../../api/axios';

import useAuth from '../../../hooks/useAuth';
import Navbar from "../../layout/Navbar";

const pages = ['Home', 'View Records', 'View Doctors'];
const links = ['/patient/home', '/patient/view/record', '/patient/view/doctor'];

const ViewDoctor = () => {
  const [users, setUsers] = useState([]);
  const [organization, setOrganization] = useState('doctor');
  const [permissionGranted, setPermissionGranted] =  useState();
  const { auth } = useAuth();

  console.log(auth);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    console.log(organization);
    const getUsers = async () => {
      try{
        if(organization === null) setOrganization("doctor");
          const response = await axiosPrivate.get('http://localhost:4000/api/patient/doctors/all/'+organization,{
          signal: controller.signal,
          headers: {
            'authorization': 'Bearer '+auth.accessToken
          }
        });
        console.log(users);
        console.log(response.data);
        isMounted && setUsers(response.data.message);
      }catch(error){
        console.log(error);
      }
    }

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [organization]);

  const onChangeOrganization = (e) => {
    setOrganization(e.target.value);

    console.log(e.target.value);
  }

  // const loadUsers = async () => {
  //   const result = await axios.get("http://localhost:3003/users");
  //   setUser(result.data);
  // };

  const handleAccess = (e) => { 
    console.log(e.target.getAttribute("data-value"));
  }
  
  return (
    <div>
      <Navbar pages={pages} links={links}></Navbar>
      <div className="container">
        <div className="select-orgs">
          <p>Select Department</p>
          <div onChange={onChangeOrganization}>
            <input type="radio" name="organization" value="doctor" defaultChecked={true} checked={organization === "doctor"}></input>Doctor
            <input type="radio" name="organization" value="laboratory" checked={organization === "laboratory"}></input>Laboratory
          </div>
        </div>
        <table className="table border">
          <thead className="table-dark">
            <tr>
              <th scope="col">Doctor Id</th>
              <th scope="col">Doctor Name</th>
              <th scope="col">Speciality</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              users.length ? (
                users.map((user) => (
                  <tr>
                    <td scope="row">{user.id}</td>
                    <td>{user.firstName + " " + user.lastName}</td>
                    <td>{user.speciality}</td>
                    <td>
                      {
                        (!user.permissionGranted) ? (<button className="btn btn-primary m-1" value={user.id} data-permission-granted={user.permissionGranted} onClick={handleAccess}>Grant</button> ): (<button className="btn btn-danger m-2" value={user.id} data-permission-granted={user.permissionGranted} onClick={handleAccess}>Revoke</button>)
                      }
                    </td>
                  </tr>
                ))
              ) : 
              <tr>
                <td colspan="4">No Doctors Found</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewDoctor;
