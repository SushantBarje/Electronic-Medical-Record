import React, { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ViewRecords.module.css';


import HistoryList from '../../HistoryList/HistoryList';

import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import useAuth from '../../../hooks/useAuth';

// const patients = [{
//   date: '22/05/022',
//   diagnosis: 'Covid',
//   updatedBy: 'Sushant Barje',
//   symptoms: 'High Fever',
//   diagnosis: 'Fever',
//   treatment: 'Crocine',
//   other: 'Complete Bed Rest',
//   followUp: 'after 12 days'
// },{
//   date: '22/05/022',
//   diagnosis: 'Covid',
//   updatedBy: 'Sushant Barje',
//   symptoms: 'High Fever',
//   diagnosis: 'Fever',
//   treatment: 'Crocine',
//   other: 'Complete Bed Rest',
//   followUp: 'after 12 days'
// }];

const ViewRecords = () => {

  const [data, setData] = useState([]);
  const{ auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function getData() {
      const controller = new AbortController();
      try{
        const response = await axiosPrivate.get('/patient/record/all/history');
        console.log(response.data);
        let resdata = response.data.message;
        const arr = [];
        for(let i = 0; i < response.data.message.length; i++){
          const dateTime = new Date(resdata[i].timestamp.seconds*1000);
          let year = dateTime.getFullYear();
          let month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
          let day = ("0" + dateTime.getDate()).slice(-2);
          // let hour = datetime.getHours();
          // let minute = datetime.getMinutes();
          // let seconds = datetime.getSeconds();
      
          let date = day+"/"+month+"/"+year;
          let time = dateTime.toLocaleTimeString();
          if(auth.username != resdata[i].updatedBy){
            arr.push({
              name: resdata[i].firstName + ' '+resdata[i].middleName + ' '+ resdata[i].lastName,
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
      }catch(err) {
        console.log(err);
      }
    }
    getData();
  },[]);

  return (
    <div className={styles.ViewRecords}>
      <div className="mt-5">
        <h3>View Records</h3> 
      </div>
      <HistoryList patients={data}></HistoryList>
    </div>
  )
};

ViewRecords.propTypes = {};

ViewRecords.defaultProps = {};

export default ViewRecords;
