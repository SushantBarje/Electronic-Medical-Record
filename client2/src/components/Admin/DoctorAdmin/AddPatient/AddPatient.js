import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './AddPatient.module.css';

import { Form, Row, Col, Button,Spinner } from 'react-bootstrap';

import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

function simulateNetworkRequest() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

const AddPatient = () => {

  const [isLoading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [address, setAddress] = useState("");
  const [allergies, setAllergies] = useState("");
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [isError, setError] = useState("");
  const [isAlert, setAlert] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if(isLoading){
      simulateNetworkRequest().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const controller = new AbortController();
    try{
      const response = await axiosPrivate.post('/admin/patient/register', JSON.stringify({
        firstName: firstName,
        middleName: middleName, 
        lastName: lastName,
        email: email,
        age: age,
        gender: gender,
        phoneNumber: phoneNumber,
        address: address,
        allergies: allergies,
        bloodGroup: bloodGroup
      }, {signal: controller.signal}));

      console.log(response.data);
      if(response.data.error === 'none'){
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
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setEmail('');
    setAge('');
    setGender('');
    setPhoneNumber('');
    setAddress('');
    setAllergies('');
    setBloodGroup('');
  }
  
  return (
  <div className={styles.AddPatient}>
    <div className="mt-5"> 
      <h3>Add Patient</h3>
    </div>
    <Form className="mt-5">
      <Row className="mb-3">
      <Form.Group as={Col} controlId="formGridFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control type="text" placeholder="Enter first name"  value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </Form.Group>
      <Form.Group as={Col} controlId="formGridMiddleName">
        <Form.Label>Middle Name</Form.Label>
        <Form.Control type="text" placeholder="Enter Middle Name"  value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
      </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}  />
        </Form.Group>
        <Form.Group as={Col} controlId="formGridAge">
          <Form.Label>Age</Form.Label>
          <Form.Control type="text" placeholder="Enter Age" value={age} onChange={(e) => setAge(e.target.value)}  />
        </Form.Group>
        <Form.Group as={Col} controlId="formGridPhoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control type="text" placeholder="Enter Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridAddress">
          <Form.Label>Email ID</Form.Label>
          <Form.Control type="email" placeholder="Enter Email ID" value={email} onChange={(e) => setEmail(e.target.value)}  />
        </Form.Group>
        <Form.Group as={Col} controlId="formGridGender">
          <Form.Label>Gender</Form.Label>
          <Form.Select aria-label="Default select example"  value={gender} onChange={(e) => setGender(e.target.value)}>
            <option></option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridBloodGroup">
          <Form.Label>Blood Group</Form.Label>
          <Form.Control type="text" placeholder="Enter Blood Group" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}  />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" placeholder="Enter Address" value={address} onChange={(e) => setAddress(e.target.value)}  />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridAllergies">
          <Form.Label>Allergies</Form.Label>
          <Form.Control type="text" placeholder="Enter Allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
        </Form.Group>
      </Row>
      <Button variant="primary" disabled={isLoading} onClick={!isLoading ? handleSubmit : null}>
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
    </Form>
  </div>)
};

AddPatient.propTypes = {};

AddPatient.defaultProps = {};

export default AddPatient;
