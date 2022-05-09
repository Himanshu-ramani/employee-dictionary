import { render, screen } from '@testing-library/react';
import App from './App';
describe('App comoponent', ()=>{

  test('renders nav link button', () => {
    render(<App />);
    const linkElement = screen.findAllByRole('link')
    expect(linkElement).toBeInTheDocument();
  });
})
