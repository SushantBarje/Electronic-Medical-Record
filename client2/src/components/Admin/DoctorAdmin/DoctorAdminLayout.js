import React from 'react';
import PropTypes from 'prop-types';
import styles from './DoctorAdminLayout.module.css';
import { Outlet } from 'react-router-dom';

import NavigationBar from '../../Navbar/Navbar';

import { Container, Row, Col } from 'react-bootstrap';

const pages = ['Home', 'Add Doctor', 'Add Patient', 'View Doctors'];
const links = ['doctor', 'add/doctor', 'add/patient', 'view/doctors'];

const DoctorAdminLayout = () => (
  <div className={styles.DoctorAdminLayout}>
    <NavigationBar pages={pages} links={links}></NavigationBar>
    <Container>
      <Row >
        <Col></Col>
        <Col xs={10}>
          <Outlet></Outlet>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  </div>
);

DoctorAdminLayout.propTypes = {};

DoctorAdminLayout.defaultProps = {};

export default DoctorAdminLayout;
