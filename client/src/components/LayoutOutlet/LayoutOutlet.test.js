import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LayoutOutlet from './LayoutOutlet';

describe('<LayoutOutlet />', () => {
  test('it should mount', () => {
    render(<LayoutOutlet />);
    
    const layoutOutlet = screen.getByTestId('LayoutOutlet');

    expect(layoutOutlet).toBeInTheDocument();
  });
});