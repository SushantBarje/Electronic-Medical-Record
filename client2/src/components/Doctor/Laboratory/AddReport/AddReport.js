import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styles from './AddReport.module.css';

const AddReport = () =>{  

  const [file, setFile] = useState("");
  return  (
    <div className={styles.AddReport}>
      <Row>
        
      </Row>
    </div>
  );
}

AddReport.propTypes = {};

AddReport.defaultProps = {};

export default AddReport;
