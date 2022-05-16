import React from 'react';
import PropTypes from 'prop-types';
import styles from './LayoutOutlet.module.css';
import { Outlet } from 'react-router-dom';

const LayoutOutlet = () => (
  <div className={styles.LayoutOutlet} data-testid="LayoutOutlet">
    <Outlet></Outlet>
  </div>
);

LayoutOutlet.propTypes = {};

LayoutOutlet.defaultProps = {};

export default LayoutOutlet;
