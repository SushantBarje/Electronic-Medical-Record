import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DoctorDashboard from './DoctorDashboard';

describe('<DoctorDashboard />', () => {
  test('it should mount', () => {
    render(<DoctorDashboard />);
    
    const DoctorDashboard = screen.getByTestId('DoctorDashboard');

    expect(DoctorDashboard).toBeInTheDocument();
  });
});