import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import CreationActivosPage from './page';

jest.mock('@/app/auth/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/CreateActivos', () =>
  jest.fn(() => <div data-testid="create-activos">CreateActivos</div>)
);

const { useAuth } = jest.requireMock('@/app/auth/AuthContext');

describe('CreationActivosPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra loading mientras verifica sesión', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: null,
      loading: true,
      verificarSesion: jest.fn(),
    });

    render(<CreationActivosPage />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    expect(screen.queryByTestId('create-activos')).not.toBeInTheDocument();
  });

  it('renderiza CreateActivos cuando está autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: { id: 1, nombre: 'Admin', email: 'admin@test.com', rol: 'admin', saldo: 50000 },
      loading: false,
      verificarSesion: jest.fn(),
    });

    render(<CreationActivosPage />);

    expect(screen.getByTestId('create-activos')).toBeInTheDocument();
    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });
});
