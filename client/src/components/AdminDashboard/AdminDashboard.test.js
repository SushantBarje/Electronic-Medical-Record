import React from 'react';
import ReactDOM from 'react-dom';
import AdminDashboard from './AdminDashboard';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AdminDashboard />, div);
  ReactDOM.unmountComponentAtNode(div);
});