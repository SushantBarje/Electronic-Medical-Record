import React from 'react';
import ReactDOM from 'react-dom';
import DetailsTable from './DetailsTable';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DetailsTable />, div);
  ReactDOM.unmountComponentAtNode(div);
});