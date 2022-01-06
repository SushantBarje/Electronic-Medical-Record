import React from 'react';
import PropTypes from 'prop-types';
import styles from './AdminDashboard.module.css';

import Header from '../Header/Header';
import DetailsTable from '../DetailsTable/DetailsTable';

const AdminDashboard = () => (
  <div className={styles.AdminDashboard}>
    <Header></Header>
    <DetailsTable></DetailsTable>
  </div>
);

AdminDashboard.propTypes = {};

AdminDashboard.defaultProps = {};

export default AdminDashboard;
