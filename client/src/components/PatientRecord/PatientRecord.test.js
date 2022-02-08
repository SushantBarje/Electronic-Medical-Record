import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PatientRecord from './PatientRecord';

describe('<PatientRecord />', () => {
  test('it should mount', () => {
    render(<PatientRecord />);
    
    const patientRecord = screen.getByTestId('PatientRecord');

    expect(patientRecord).toBeInTheDocument();
  });
});