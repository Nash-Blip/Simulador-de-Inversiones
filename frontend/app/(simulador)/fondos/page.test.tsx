import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import FondosPage from './page';

jest.mock('@/app/auth/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/GestionFondos', () =>
  jest.fn(() => <div data-testid="gestion-fondos">GestionFondos</div>)
);

const { useAuth } = jest.requireMock('@/app/auth/AuthContext');

describe('FondosPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra loading mientras verifica sesión', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: null,
      loading: true,
      verificarSesion: jest.fn(),
    });

    render(<FondosPage />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    expect(screen.queryByTestId('gestion-fondos')).not.toBeInTheDocument();
  });

  it('renderiza GestionFondos cuando está autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: { id: 1, nombre: 'User', email: 'user@test.com', rol: 'user', saldo: 50000 },
      loading: false,
      verificarSesion: jest.fn(),
    });

    render(<FondosPage />);

    expect(screen.getByTestId('gestion-fondos')).toBeInTheDocument();
    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });
});
