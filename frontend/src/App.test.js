import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders the home page navigation', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  expect(screen.getByText(/software cost estimation tool/i)).toBeInTheDocument();
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});
