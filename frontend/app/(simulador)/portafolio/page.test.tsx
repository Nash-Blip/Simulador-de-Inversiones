import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import PortafolioPage from './page';

jest.mock('@/app/auth/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/Portafolio', () =>
  jest.fn(() => <div data-testid="portafolio">PortafolioComp</div>)
);

const { useAuth } = jest.requireMock('@/app/auth/AuthContext');

describe('PortafolioPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra loading mientras verifica sesión', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: null,
      loading: true,
      verificarSesion: jest.fn(),
    });

    render(<PortafolioPage />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    expect(screen.queryByTestId('portafolio')).not.toBeInTheDocument();
  });

  it('renderiza PortafolioComp cuando está autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: { id: 1, nombre: 'User', email: 'user@test.com', rol: 'user', saldo: 50000 },
      loading: false,
      verificarSesion: jest.fn(),
    });

    render(<PortafolioPage />);

    expect(screen.getByTestId('portafolio')).toBeInTheDocument();
    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });
});
