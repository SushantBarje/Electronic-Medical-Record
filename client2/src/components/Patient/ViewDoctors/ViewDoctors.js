import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './ViewDoctors.module.css';

import {Button} from 'react-bootstrap';

import DataTable from 'react-data-table-component';
import styled from '@emotion/styled';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableCell, TableContainer, TableHead, TablePagination} from '@mui/material';

import useAxiosPrivate from '../../../hooks/useAxiosPrivate';


const ViewDoctors = () => {

  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const columns = [
    {
      id: 'id',
      label: 'Username',
      minWidth: 170,
      align: 'center',
    },
    {
      id: 'name',
      label: 'Name',
      minWidth: 170,
      align: 'center',
    },
    {
      id: 'speciality',
      label: 'Speciality',
      minWidth: 170,
      align: 'center',
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 170,
      align: 'center',
    }, 
    {
      id: 'action',
      label: 'Action',
      minWidth: 170,
      align: 'center',
    }, 
  ];

  
  useEffect(() => {
    async function getData() {
      const controller = new AbortController();
      try{
        const response = await axiosPrivate.get('/patient/doctors/all/doctor');
        console.log(response.data);
        let resdata = response.data.message;
        const arr = [];
        for(let i = 0; i < response.data.message.length; i++){
          arr.push({id : resdata[i].id, name: resdata[i].firstName + ' '+ resdata[i].lastName,speciality: resdata[i].speciality, department: resdata[i].organization, permission: resdata[i].permissionGranted});
        }
        setData(arr);

        let obj = [];
        for(let i = 0; i < response.data.message.length; i++){
          console.log(resdata)
          let key = resdata[i].id;
          console.log(key);
          let value = resdata[i].permissionGranted;
          let d = {};
          d[key] = value;
          obj.push(d);
        }
        setPermissions(obj);
        console.log(data);
        console.log(obj);
      }catch(err) {
        console.log(err);
      }
    }
    getData();
  },[]);

  const handlePermissions = index => e => {
    let id = e.target.id;
    let value = e.currentTarget.getAttribute("data-value");
    let newArray = [...permissions];
    newArray[index][id] = value == 1 ? 0 : 1;
    console.log("permission: "+ value);
    console.log("bool: " + (value == 1));
    const permissionURL = value == 1 ? "/patient/doctors/remove" : "/patient/doctors/grant";
    try{
      const response = axiosPrivate.patch(permissionURL, JSON.stringify({doctorId: id}), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      console.log(response.data);
      if(response?.data?.error === 'none'){
        console.log("success");
        //setError('success');
      }else{
        console.log(response.data.error);
        console.log("failed");
        //setError('failed');
      }
      //setLoading(false);
      //setAlert(true);
    }catch(err){
      console.log(err);
    }
    setPermissions(newArray);
  }

  useEffect(() => {

  },[permissions]);

  return (
    <div className={styles.ViewDoctors}>
      <div className="mt-5"> 
          <h3>View Doctors</h3>
        </div>
        <div className="mt-5">
          {/* <CustomeTheme>
            <DataTable
              columns={[columns, data.permission]}
              data={data}
              direction="auto"
              fixedHeaderScrollHeight="300px"
              pagination
              responsive
            />
          </CustomeTheme> */}

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={row.id} >
                        <TableCell align={"center"}>{row.id}</TableCell>
                        <TableCell key={row.name} align={"center"}>{row.name}</TableCell>
                        <TableCell key={row.speciality} align={"center"}>{row.speciality}</TableCell>
                        <TableCell key={row.department} align={"center"}>{row.department}</TableCell>
                        <TableCell align={"center"} id={row.id}>
                          {
                            permissions[index][row.id] === 1 ?
                            (
                              <Button variant='danger' id={row.id} data-value={permissions[index][row.id]} onClick={handlePermissions(index)}>Revoke</Button>
                            ):
                            (
                              <Button variant='primary' id={row.id} data-value={permissions[index][row.id]} onClick={handlePermissions(index)}>Grant</Button>
                            )
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
    </div>
  );
}

ViewDoctors.propTypes = {};

ViewDoctors.defaultProps = {};

export default ViewDoctors;
