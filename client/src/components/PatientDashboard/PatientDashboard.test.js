import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PatientDashboard from './PatientDashboard';

describe('<PatientDashboard />', () => {
  test('it should mount', () => {
    render(<PatientDashboard />);
    
    const patientDashboard = screen.getByTestId('PatientDashboard');

    expect(patientDashboard).toBeInTheDocument();
  });
});