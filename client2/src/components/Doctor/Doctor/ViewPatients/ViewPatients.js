import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import styles from './ViewPatients.module.css';
import { Link, useNavigate } from 'react-router-dom';

import {Row, Col} from 'react-bootstrap';
import {Button} from 'react-bootstrap';

import DataTable from 'react-data-table-component';
import styled from '@emotion/styled';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableCell, TableContainer, TableHead, TablePagination} from '@mui/material';

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
    id: 'action',
    label: 'Action',
    minWidth: 170,
    align: 'center',
  },
];

const CustomeTheme = styled.div`
.rdt_TableHead{
  font-size: 18px
};
.rdt_TableRow{
  font-size: 15px
}
`;

const ViewPatients = () => {

  const [data, setData] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  let navigate = useNavigate();

  useEffect(() =>{
    async function getData() {
      const controller = new AbortController();
      try{
        const response = await axiosPrivate.get('/doctor/patient/all');
        console.log(response.data.message);
        let resdata = response.data.message;
        const arr = [];
        for(let i = 0; i < response.data.message.length; i++){
          arr.push({
            id : resdata[i].patientId, 
            name: resdata[i].firstName + ' ' + resdata[i].middleName + ' '+ resdata[i].lastName,
            });
        }
        setData(arr);
       console.log(data);
      }catch(err) {
        console.log(err);
      }
    }
    getData();
  }, []);

  const handleViewData  = (index) => e => {
    //e.preventDefault();
    console.log(e.target.id);
    let id = e.target.id;
    let url = "../view/patient/"+id;
    console.log(url);
    navigate(url, {replace: true});
    // <Link to={"../view/patient/PID2"}>View Patient</Link>
  }
  const handleAddData  = (index) => e => {
    e.preventDefault();
    let id = e.target.id;
    let url = "../view/patient/"+id+"/add";
    console.log(url);
    navigate(url, {replace: true});
    //<Link to={"../add/patient/PID2"}>View Patient</Link>
  }


  return (
    <div className={styles.ViewPatients}>
      <div className="mt-5"> 
        <h3>View Patients</h3>
      </div>
      {/* <Link to={"../view/patient/PID2"}>View Patient</Link> */}
      <div className="mt-5">
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
                      <TableCell align={"center"}>
                        {/* <Link to={"../view/patient/"+row.id}>View Patient</Link> */}
                        <Button variant="primary" id={row.id} onClick={handleAddData(index)} className="me-2">Add</Button>
                        <Button variant="success" id={row.id} onClick={handleViewData(index)}>View</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <CustomeTheme>
          <DataTable
            columns={columns}
            data={data}
            direction="auto"
            fixedHeaderScrollHeight="300px"
            pagination
            responsive
          />
        </CustomeTheme> */}

      </div>
    </div>
  );

}

ViewPatients.propTypes = {};

ViewPatients.defaultProps = {};

export default ViewPatients;
