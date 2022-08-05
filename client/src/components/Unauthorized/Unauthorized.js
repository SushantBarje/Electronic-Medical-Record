import React from 'react';
import PropTypes from 'prop-types';
import styles from './Unauthorized.module.css';

import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {

  const navigate =  useNavigate();

  const goBack = () => navigate(-1);  

  return (
    <div className={styles.Unauthorized} data-testid="Unauthorized">
      <p>You are Unauthorized</p>
      <div className="flexGrow">
        <button onClick={goBack}>Go back</button>
      </div>
    </div>
  );
};

Unauthorized.propTypes = {};

Unauthorized.defaultProps = {};

export default Unauthorized;
