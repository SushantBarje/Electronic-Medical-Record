import React from 'react';
import PropTypes from 'prop-types';
import styles from './Patient.module.css';

import { Outlet } from 'react-router-dom';

import NavigationBar from '../Navbar/Navbar';

import { Container, Row, Col } from 'react-bootstrap';

const pages = ['Home', 'View Doctors', 'View Records'];
const links = ['', 'view/doctors', 'view/records'];

const Patient = () => (
  <div className={styles.Patient}>
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

Patient.propTypes = {};

Patient.defaultProps = {};

export default Patient;
