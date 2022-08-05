import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RequireAuth from './RequireAuth';

describe('<RequireAuth />', () => {
  test('it should mount', () => {
    render(<RequireAuth />);
    
    const requireAuth = screen.getByTestId('RequireAuth');

    expect(requireAuth).toBeInTheDocument();
  });
});