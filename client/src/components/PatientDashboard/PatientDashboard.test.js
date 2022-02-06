import React from 'react';
import ReactDOM from 'react-dom';
import PatientDashboard from './PatientDashboard';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PatientDashboard />, div);
  ReactDOM.unmountComponentAtNode(div);
});