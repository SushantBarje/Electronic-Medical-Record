import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Unauthorized from './Unauthorized';

describe('<Unauthorized />', () => {
  test('it should mount', () => {
    render(<Unauthorized />);
    
    const unauthorized = screen.getByTestId('Unauthorized');

    expect(unauthorized).toBeInTheDocument();
  });
});