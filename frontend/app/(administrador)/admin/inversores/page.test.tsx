import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import ListaInversoresPage from './page';

jest.mock('@/app/auth/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/ListInversores', () =>
  jest.fn(() => <div data-testid="list-inversores">ListInversores</div>)
);

const { useAuth } = jest.requireMock('@/app/auth/AuthContext');

describe('ListaInversoresPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra loading mientras verifica sesión', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: null,
      loading: true,
      verificarSesion: jest.fn(),
    });

    render(<ListaInversoresPage />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    expect(screen.queryByTestId('list-inversores')).not.toBeInTheDocument();
  });

  it('renderiza ListInversores cuando está autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: { id: 1, nombre: 'Admin', email: 'admin@test.com', rol: 'admin', saldo: 50000 },
      loading: false,
      verificarSesion: jest.fn(),
    });

    render(<ListaInversoresPage />);

    expect(screen.getByTestId('list-inversores')).toBeInTheDocument();
    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });
});
