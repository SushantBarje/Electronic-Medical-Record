import React from 'react';
import PropTypes from 'prop-types';
import styles from './LaboratoryAdminLayout.module.css';

import { Outlet } from 'react-router-dom';

import NavigationBar from '../../Navbar/Navbar';

import { Container, Row, Col } from 'react-bootstrap';

const pages = ['Home', 'Add Doctor', 'View Doctors'];
const links = ['', 'add/doctor', 'view/doctors'];

const LaboratoryAdminLayout = () => (
  <div className={styles.LaboratoryAdminLayout}>
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

LaboratoryAdminLayout.propTypes = {};

LaboratoryAdminLayout.defaultProps = {};

export default LaboratoryAdminLayout;
