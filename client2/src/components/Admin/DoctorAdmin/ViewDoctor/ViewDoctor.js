import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ViewDoctor.module.css';

import DataTable from 'react-data-table-component';
import styled from '@emotion/styled';

import { Button } from 'react-bootstrap';

import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

const columns = [
    {
      name: 'ID',
      selector: row => row.id,
    },
    {
      name: 'Name',
      selector: row => row.name,
    },
    {
      name: 'Speciality',
      selector: row => row.speciality
    },
    {
      name: 'Department',
      selector: row => row.department
    },
    {
      cell:(row) => <Button variant="danger" id={row.id}>Delete</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
];

const CustomeTheme = styled.div`
  .rdt_TableHead{
    font-size: 18px
  };
  .rdt_TableRow{
    font-size: 15px
  }
`;


const ViewDoctor = () => {

  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  
  useEffect(() =>{
    async function getData() {
      const controller = new AbortController();
      try{
        const response = await axiosPrivate.get('/admin/doctors/all/doctor');
        console.log(response.data);
        let resdata = response.data.message;
        const arr = [];
        for(let i = 0; i < response.data.message.length; i++){
          arr.push({id : resdata[i].id, name: resdata[i].firstName + ' '+ resdata[i].lastName,speciality: resdata[i].speciality, department: resdata[i].organization});
        }
        setData(arr);
        console.log(data);
      }catch(err) {
        console.log(err);
      }
    }
    getData();
  }, []);

  return (
    <div className={styles.ViewDoctor}>
      <div className="mt-5"> 
        <h3>View Doctors</h3>
      </div>
      <div className="mt-5">
        <CustomeTheme>
          <DataTable
            columns={columns}
            data={data}
            direction="auto"
            fixedHeaderScrollHeight="300px"
            pagination
            responsive
          />
        </CustomeTheme>
      </div>
    </div>
  );
}

ViewDoctor.propTypes = {};

ViewDoctor.defaultProps = {};

export default ViewDoctor;
