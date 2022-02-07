import React from 'react';
import PropTypes from 'prop-types';
import styles from './DoctortDashboard.module.css';

import Header from '../Header/Header';

const pages = ['View Record', 'View Pentient'];
const settings = [];

const DoctorDashboard = () => (
  <div className={styles.DoctorDashboard} data-testid="DoctorDashboard">
    <div className="app-header">
      <Header pages={pages}  settings={settings}></Header>
    </div>
  </div>
);

DoctorDashboard.propTypes = {};

DoctorDashboard.defaultProps = {};

export default DoctorDashboard;