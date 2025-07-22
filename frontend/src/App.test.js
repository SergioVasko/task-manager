import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header Task Manager', () => {
  render(<App />);
  const headerElement = screen.getByText(/Task Manager/i);
  expect(headerElement).toBeInTheDocument();
});
