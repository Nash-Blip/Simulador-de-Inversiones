import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import PerfilPage from './page';

jest.mock('@/app/auth/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/InversorProfile', () =>
  jest.fn(() => <div data-testid="inversor-profile">InversorProfile</div>)
);

const { useAuth } = jest.requireMock('@/app/auth/AuthContext');

describe('PerfilPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra loading mientras verifica sesión', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: null,
      loading: true,
      verificarSesion: jest.fn(),
    });

    render(<PerfilPage />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    expect(screen.queryByTestId('inversor-profile')).not.toBeInTheDocument();
  });

  it('renderiza InversorProfile cuando está autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: { id: 1, nombre: 'User', email: 'user@test.com', rol: 'user', saldo: 50000 },
      loading: false,
      verificarSesion: jest.fn(),
    });

    render(<PerfilPage />);

    expect(screen.getByTestId('inversor-profile')).toBeInTheDocument();
    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });
});
