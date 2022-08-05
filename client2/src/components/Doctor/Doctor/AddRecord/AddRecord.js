import React, {useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './AddRecord.module.css';

import { Form, Row, Col, Button,Spinner } from 'react-bootstrap';

import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert/Alert';
import { AlertTitle } from '@mui/material';

import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

const AddRecord = () => {

  const { patientId } = useParams();

  const [isLoading, setLoading] = useState(false);
  const [patientID, setPatientID] = useState(patientId);
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [other, setOther] = useState("");
  const [followUp, setFollowUp] = useState("");

  const [isError, setError] = useState("");
  const [isAlert, setAlert] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  

  useEffect(() => {
   
  }, [isLoading]) 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const response = await axiosPrivate.post('/doctor/patient/record/add', JSON.stringify({
        patientId: patientID, 
        symptoms: symptoms,
        diagnosis: diagnosis,
        treatment: treatment,
        other: other,
        followUp: followUp
      }));
      
      console.log(response.data);
      if(response?.data?.error === 'none'){
        setError('success');
      }else{
        setError('failed');
      }
      setLoading(false);
      setAlert(true);
    }catch(err){
      console.log(err);
    }

    setLoading(false);
  }

  return (
    <div className={styles.AddRecord}>
      <div className="mt-5"> 
        <h3>Add Record</h3>
      </div>
      <Form className="mt-3">
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={2}>
            Patient ID
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" disabled value={patientID} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
          <Form.Label column sm={2}>
            Symptoms
          </Form.Label>
          <Col sm={10}>
            <Form.Control as="textarea" rows={2} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
          </Col>
        </Form.Group>
        
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
          <Form.Label column sm={2}>
            Diagnosis
          </Form.Label>
          <Col sm={10}>
            <Form.Control as="textarea" rows={2} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
          <Form.Label column sm={2}>
            Treatment 
          </Form.Label>
          <Col sm={10}>
            <Form.Control as="textarea" rows={3} value={treatment} onChange={(e) => setTreatment(e.target.value)} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
          <Form.Label column sm={2}>
            Other Description
          </Form.Label>
          <Col sm={10}>
            <Form.Control as="textarea" rows={3} value={other} onChange={(e) => setOther(e.target.value)} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
          <Form.Label column sm={2}>
            Follow Up
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" placeholder="Enter Follow Up" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Col sm={{ span: 10, offset: 2 }}>
            <Button variant="primary"disabled={isLoading} onClick={!isLoading ? handleSubmit : null}>
              { isLoading ? (
                <span>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span> Loading...</span>
              </span>
              ) : 'Submit'}
            </Button>
          </Col>
        </Form.Group>
      </Form>
      {
        isAlert ? (
          (isError === 'success') ? ( 
          <Alert className="mt-2" severity="success">
            <AlertTitle>Success</AlertTitle>
              Record Added Successfully
          </Alert>
          ) : ( 
            <Alert className="mt-2" severity="error">
              <AlertTitle>Failed</AlertTitle>
                Record Adding Failed.
            </Alert>
          )
        ) : (<div>

        </div>)
      }
    </div>
  );
}

AddRecord.propTypes = {};

AddRecord.defaultProps = {};

export default AddRecord;
