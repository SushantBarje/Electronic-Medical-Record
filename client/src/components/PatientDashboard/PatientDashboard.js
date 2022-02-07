import React from 'react';
import PropTypes from 'prop-types';
import styles from './PatientDashboard.module.css';

import Header from '../Header/Header';

const pages = ['View Record', 'View Doctor'];
const settings = [];

const PatientDashboard = () => (
  <div className={styles.PatientDashboard} data-testid="PatientDashboard">
    <div className="app-header">
      <Header pages={pages}  settings={settings}></Header>
    </div>
  </div>
);

PatientDashboard.propTypes = {};

PatientDashboard.defaultProps = {};

export default PatientDashboard;
