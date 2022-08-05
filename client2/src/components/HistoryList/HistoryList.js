import React from 'react';
import PropTypes from 'prop-types';
import styles from './HistoryList.module.css';

import { Accordion, Container, Col, Row } from 'react-bootstrap';

const HistoryList = ({patients}) => {
  const p = Object.values(patients);
  console.log(p);
  return (
    <div className={`${styles.HistoryList} mt-5`} >
      <Accordion  defaultActiveKey="0">
        {
          p.map((patient, index) => (
            
            <Accordion.Item className="mt-3 border-top" eventKey={index}>
              <Accordion.Header>
                <Container>
                  <Row>
                    <Col>
                      Date: {patient.dateTime.date + " "+ patient.dateTime.time} 
                    </Col>
                    <Col>
                      <h5>
                        Diagnosis by: {patient.diagnosis}
                      </h5>
                    </Col>
                  </Row>
                  <Row className="mt-1">
                    <Col>
                      Treated by: Dr. {patient.updatedBy}
                    </Col>
                  </Row>
                </Container>
              </Accordion.Header>
              <Accordion.Body>
                <Container>
                  <Row >
                    <Col xs={2}>
                      <p>Symptoms: </p>
                    </Col>
                    <Col xs={5} >
                      <p>{patient.symptoms}</p>
                    </Col>
                  </Row>
                  <Row >
                    <Col xs={2}>
                      <p>Treatment: </p>
                    </Col>
                    <Col xs={5} >
                      <p>{patient.treatment}</p>
                    </Col>
                  </Row>
                  <Row >
                    <Col xs={2}>
                      <p>Other description: </p>
                    </Col>
                    <Col xs={5}>
                      <p>{patient.other}</p>
                    </Col>
                  </Row>
                  <Row >
                    <Col xs={2}>
                      <p>Follow up: </p>
                    </Col>
                    <Col xs={5}>
                      <p>{patient.followUp}</p>
                    </Col>
                  </Row>
                </Container>
              </Accordion.Body>
            </Accordion.Item>
          ))
        }
      </Accordion>
    </div>
  );
}

HistoryList.propTypes = {};

HistoryList.defaultProps = {};

export default HistoryList;
