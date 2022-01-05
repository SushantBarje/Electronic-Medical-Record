import React from 'react';
import PropTypes from 'prop-types';
import styles from './Header.module.css';

const Header = () => (
  <div className={styles.Header}>
    <h2>Electronic Medical Record</h2>
  </div>
);

Header.propTypes = {};

Header.defaultProps = {};

export default Header;
