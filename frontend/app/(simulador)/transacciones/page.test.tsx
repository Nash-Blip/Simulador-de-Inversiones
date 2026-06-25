import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import TransaccionesPage from './page';

jest.mock('@/app/auth/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/TransaccionList', () =>
  jest.fn(() => <div data-testid="transaccion-list">TransaccionList</div>)
);

const { useAuth } = jest.requireMock('@/app/auth/AuthContext');

describe('TransaccionesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra loading mientras verifica sesión', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: null,
      loading: true,
      verificarSesion: jest.fn(),
    });

    render(<TransaccionesPage />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    expect(screen.queryByTestId('transaccion-list')).not.toBeInTheDocument();
  });

  it('renderiza TransaccionList cuando está autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: { id: 1, nombre: 'User', email: 'user@test.com', rol: 'user', saldo: 50000 },
      loading: false,
      verificarSesion: jest.fn(),
    });

    render(<TransaccionesPage />);

    expect(screen.getByTestId('transaccion-list')).toBeInTheDocument();
    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });
});
