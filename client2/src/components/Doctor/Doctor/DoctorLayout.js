import React from 'react';
import PropTypes from 'prop-types';
import styles from './Doctor.module.css';

import { Outlet } from 'react-router-dom';

import NavigationBar from '../../Navbar/Navbar';

import { Container, Row, Col } from 'react-bootstrap';

const pages = ['Home', 'View Patients'];
const links = ['', 'view/patients'];

const DoctorLayout = () => (
  <div className={styles.Doctor}>
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

DoctorLayout.propTypes = {};

DoctorLayout.defaultProps = {};

export default DoctorLayout;