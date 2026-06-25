import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import SimuladorLayout from './layout';

jest.mock('@/components/AppBar', () =>
  jest.fn(() => <div data-testid="appbar">AppBar</div>)
);

jest.mock('@/components/RouteGuard', () =>
  jest.fn(({ children }: { children: ReactNode }) => <>{children}</>)
);

jest.mock('../auth/AuthContext', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('SimuladorLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza AppBar y children envueltos en RouteGuard', () => {
    render(<SimuladorLayout><div data-testid="child">Contenido</div></SimuladorLayout>);

    expect(screen.getByTestId('appbar')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
