import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import ListTransaccionesPage from './page';

jest.mock('@/app/auth/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/ListTransacciones', () =>
  jest.fn(() => <div data-testid="list-transacciones">ListTransacciones</div>)
);

const { useAuth } = jest.requireMock('@/app/auth/AuthContext');

describe('ListTransaccionesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra loading mientras verifica sesión', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: null,
      loading: true,
      verificarSesion: jest.fn(),
    });

    render(<ListTransaccionesPage />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    expect(screen.queryByTestId('list-transacciones')).not.toBeInTheDocument();
  });

  it('renderiza ListTransacciones cuando está autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: { id: 1, nombre: 'Admin', email: 'admin@test.com', rol: 'admin', saldo: 50000 },
      loading: false,
      verificarSesion: jest.fn(),
    });

    render(<ListTransaccionesPage />);

    expect(screen.getByTestId('list-transacciones')).toBeInTheDocument();
    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });
});
