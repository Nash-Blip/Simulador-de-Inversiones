import { render, screen } from '@testing-library/react';
import RegisterPage from './page';

jest.mock('@/components/RegisterForm', () =>
  jest.fn(() => <div data-testid="register-form">RegisterForm</div>)
);

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza RegisterForm', () => {
    render(<RegisterPage />);

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });
});
