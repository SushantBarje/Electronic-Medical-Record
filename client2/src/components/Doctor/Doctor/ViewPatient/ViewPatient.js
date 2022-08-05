import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import styles from './ViewPatient.module.css';
import { useParams } from 'react-router-dom';

import {Container, Row, Col} from 'react-bootstrap';

import  useAxiosPrivate  from '../../../../hooks/useAxiosPrivate';
import HistoryList from '../../../HistoryList/HistoryList';

import useAuth from '../../../../hooks/useAuth';

const ViewPatient = () => {
  
  const { patientId } = useParams();
  const [ data, setData ] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const{ auth } = useAuth();
  
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [allergies, setAllergies] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

  useEffect(() =>{
    async function getData() {
      const controller = new AbortController();
      try{
        console.log(patientId);
        console.log('/doctor/patient/record/'+patientId+'/history');
        const response = await axiosPrivate.get('/doctor/patient/record/'+patientId+'/history');
        console.log(response.data);
        let resdata = response.data.message;
        setId(resdata[0].patientId);
        setName(resdata[0].firstName + ' ' + resdata[0].middleName + ' ' + resdata[0].lastName);
        setGender(resdata[0].gender);
        setAge(resdata[0].age);
        setAllergies(resdata[0].allergies);
        setPhoneNumber(resdata[0].phoneNumber);
        setBloodGroup(resdata[0].bloodGroup);
       
        const arr = [];
        for(let i = 0; i < response.data.message.length; i++){
          const dateTime = new Date(resdata[i].timestamp.seconds*1000);
          let year = dateTime.getFullYear();
          let month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
          let day = ("0" + dateTime.getDate()).slice(-2);
      
          let date = day+"/"+month+"/"+year;
          let time = dateTime.toLocaleTimeString();
        
          if(resdata[i].updatedBy != resdata[i].patientId){
            arr.push({
              dateTime: {date, time},
              diagnosis: resdata[i].diagnosis,
              updatedBy: resdata[i].updatedBy,
              symptoms: resdata[i].symptoms,
              treatment: resdata[i].treatment,
              other: resdata[i].other,
              followUp: resdata[i].followUp
            });
          }
          
        }
        console.log("arrayMy : "+ arr);
        setData(arr);
        console.log(data);
        // const arr = [];
        // for(let i = 0; i < response.data.message.length; i++){
        //   arr.push({id : resdata[i].id, name: resdata[i].firstName + ' '+ resdata[i].lastName,speciality: resdata[i].speciality, department: resdata[i].organization});
        // }
        // setData(arr);
        // console.log(data);
      }catch(err) {
        console.log(err);
      }
    }
    getData();
  }, []);
  
  return (
    <div className={styles.ViewPatient}>
      <div className="mt-5"> 
        <h3>View Patients</h3>
      </div>
      <Container className="mt-5">
        <Row className="border">
          <Col className="sm-12">
            <Row>
              <Col><p className="fw-bold">PatientID: </p></Col>
              <Col>{id}</Col>
              <Col></Col>
              <Col></Col>
              <Col></Col>
            </Row>
            <Row className="border">
              <Col><p className="fw-bold">Patient Name: </p></Col>
              <Col>{name}</Col>
              <Col></Col>
              <Col></Col>
            </Row>
            <Row>
              <Col><p className="fw-bold">Age: </p></Col>
              <Col>{age}</Col>
              <Col></Col>
              <Col></Col>
              <Col></Col>
            </Row>
          </Col>
          <Col className="sm-12">
            <Row>
              <Col className="fw-bold sm-12"><p>Gender: </p></Col>
              <Col>Male</Col>
              <Col></Col>
              <Col></Col>
              <Col></Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <div className="mt-5"> 
        <h4>History</h4>
      </div>
      <div>
        <HistoryList patients={data}></HistoryList>
      </div>
    </div>
  )
};

ViewPatient.propTypes = {};

ViewPatient.defaultProps = {};

export default ViewPatient;
