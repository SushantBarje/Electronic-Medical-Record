import React from 'react';
import PropTypes from 'prop-types';
import styles from './DetailsTable.module.css';

import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { Icon } from '@mui/material';

const renderEditButton = (params) => {
  return (
    <strong>
        <IconButton>
          <EditIcon color='primary'> 
          </EditIcon>
        </IconButton>
    </strong>
)
}

const renderDeleteButton = (params) => {
  return (
    <strong>
      <IconButton>
        <DeleteIcon color='danger'> 
        </DeleteIcon>
      </IconButton>
    </strong>
)
}


const columns = [
  { field: 'id', headerName: 'ID', width: 80 },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 300,
    valueGetter: (params) =>
      `${params.getValue(params.id, 'firstName') || ''} ${
        params.getValue(params.id, 'lastName') || ''
      }`,
  },
  { field: 'specialization', headerName: 'Specialization', width: 300},
  {
    field: 'department',
    headerName: 'Department',
    width: 200,
  },
  {field: 'edit', headerName: '', width: 220, renderCell: () => (<><renderEditButton></renderEditButton><renderDeleteButton/></>)}
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon',specialization: 'Dentist', department: 'XYZ', age: 35},
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', specialization: 'Dentist', department: 'XYZ', age: 42},
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', specialization: 'Dentist', department: 'XYZ', age: 45},
  { id: 4, lastName: 'Stark', firstName: 'Arya', specialization: 'Dentist', department: 'XYZ', age: 16},            
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', specialization: 'Denti st', department: 'XYZ', age: null},
  { id: 6, lastName: 'Melisandre', firstName: null, specialization: 'Dentist', department: 'XYZ', age: 150},
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', specialization: 'Dentist', department: 'XYZ', age: 44},                          
  { id: 8, lastName: 'Frances', firstName: 'Rossini', specialization: 'Dentist', department: 'XYZ', age: 36},                         
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', specialization: 'Dentist', department: 'XYZ', age: 65},
];

const DetailsTable = () => (
  <div className={styles.DetailsTable}>
    <div style={{ height: 600, width: '60%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        stickyHeader 
        aria-label="sticky table"
      />
    </div>
  </div>
);

DetailsTable.propTypes = {};

DetailsTable.defaultProps = {};

export default DetailsTable;
