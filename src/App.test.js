import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', {'value': 'Click me'});
  expect(buttonElement).toBeInTheDocument();
});
