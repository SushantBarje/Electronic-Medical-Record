import React from 'react';
import PropTypes from 'prop-types';
import styles from './Navbar.module.css';

import { Link } from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';

import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const NavigationBar = ({pages, links}) => (
  <div className={styles.Navbar}>
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container>
      <Navbar.Brand href="#home">HealthChain</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          {
            pages.map((page, index) => (
              // <Link to={links[index]}>
              <LinkContainer to={links[index]}>
                <Nav.Link>{page}</Nav.Link>
              </LinkContainer>
                
              // </Link>
            ))
          } 
        </Nav>
      </Navbar.Collapse>
      </Container>
    </Navbar>
  </div>
);

NavigationBar.propTypes = {};

NavigationBar.defaultProps = {};

export default NavigationBar;
