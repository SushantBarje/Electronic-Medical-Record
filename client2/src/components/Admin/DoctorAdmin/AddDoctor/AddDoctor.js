import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import styles from './AddDoctor.module.css';

import Alert from '@mui/material/Alert/Alert';
import { AlertTitle } from '@mui/material';

import { Form, Row, Col, Button,Spinner } from 'react-bootstrap';

import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

function simulateNetworkRequest() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

const AddDoctor = () =>{ 
  const [isLoading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setError] = useState("");
  const [isAlert, setAlert] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
   
  }, [isLoading, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(firstName);
    console.log(lastName);
    console.log(speciality);
    console.log(username);
    console.log(password);  
    //let isMounted =  true;
    try{
      const response = await axiosPrivate.post('/admin/doctors/register', JSON.stringify({
        firstName: firstName, 
        lastName: lastName,
        speciality: speciality,
        username: username,
        password: password
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
    
    setFirstName('');
    setLastName('');
    setSpeciality('');
    setUsername('');
    setPassword('');
    setLoading(false);
  }

  return (
    <div className={styles.AddDoctor}>
      
      <div className="mt-5"> 
        <h3>Add Doctor</h3>
      </div>
      <Form className="mt-5" >
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="Enter first name" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Last Name" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridSpeciality">
            <Form.Label>Speciality</Form.Label>
            <Form.Control type="text" placeholder="Enter Speciality" name="speciality" value={speciality} onChange={(e) => setSpeciality(e.target.value)} />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter Username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
        </Row>
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
      </Form>
      {
        isAlert ? (
          (isError === 'success') ? ( 
          <Alert className="mt-2" severity="success">
            <AlertTitle>Success</AlertTitle>
              {`${username} Added Successfully`}
          </Alert>
          ) : ( 
            <Alert className="mt-2" severity="error">
              <AlertTitle>Failed</AlertTitle>
                Registration Failed.
            </Alert>
          )
        ) : (<div>

        </div>)
      }
      
    </div>
  )
}

AddDoctor.propTypes = {};

AddDoctor.defaultProps = {};

export default AddDoctor;
