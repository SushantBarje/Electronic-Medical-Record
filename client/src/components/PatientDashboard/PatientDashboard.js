import React from 'react';
import PropTypes from 'prop-types';
import styles from './PatientDashboard.module.css';
import TextField from '@mui/material/TextField';
import Header from '../Header/Header';


const pages = ['View Record', 'View Doctor'];
const settings = [];

const PatientDashboard = () => (
  <div data-testid="PatientDashboard">
    <div className="app-header">
      <Header pages={pages}  settings={settings}></Header>
      <div className="form-box" style={{display:'flex', textAlign:'center', justifyContent:'center'}}>
        <input style className="Username" type="text" placeholder='Username'></input>
        <input className="user-name" type="text" placeholder='Name'></input>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        <TextField id="filled-basic" label="Filled" variant="filled" />
        <TextField id="standard-basic" label="Standard" variant="standard" />
        </div>  
      </div>
  </div>
);

PatientDashboard.propTypes = {};

PatientDashboard.defaultProps = {};

export default PatientDashboard;
