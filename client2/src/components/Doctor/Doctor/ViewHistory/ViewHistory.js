import React from 'react';
import PropTypes from 'prop-types';
import styles from './ViewHistory.module.css';
import HistoryList from '../../../HistoryList/HistoryList';


const ViewHistory = () =>{

  return (
    <div className={styles.ViewHistory}>
      <div className="mt-5">
       <h3>View Records</h3> 
      </div>
      {/* <HistoryList patients={patients}></HistoryList> */}
    </div>
  );
} 

ViewHistory.propTypes = {};

ViewHistory.defaultProps = {};

export default ViewHistory;
