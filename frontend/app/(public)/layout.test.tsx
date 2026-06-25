import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import PublicLayout from './layout';

jest.mock('@/components/NavBar', () =>
  jest.fn(() => <div data-testid="navbar">NavBar</div>)
);

jest.mock('@/components/Footer', () =>
  jest.fn(() => <div data-testid="footer">Footer</div>)
);

jest.mock('../auth/AuthContext', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('PublicLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza NavBar, children y Footer', () => {
    render(<PublicLayout><div data-testid="child">Contenido</div></PublicLayout>);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
