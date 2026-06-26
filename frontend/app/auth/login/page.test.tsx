import { render, screen } from '@testing-library/react';
import LoginPage from './page';

jest.mock('@/components/LoginForm', () =>
  jest.fn(() => <div data-testid="login-form">LoginForm</div>)
);

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza LoginForm', () => {
    render(<LoginPage />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
