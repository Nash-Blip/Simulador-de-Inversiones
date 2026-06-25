import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import MercadoPage from './page';

jest.mock('@/app/auth/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/Mercado', () =>
  jest.fn(() => <div data-testid="mercado">Mercado</div>)
);

const { useAuth } = jest.requireMock('@/app/auth/AuthContext');

describe('MercadoPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra loading mientras verifica sesión', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: null,
      loading: true,
      verificarSesion: jest.fn(),
    });

    render(<MercadoPage />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    expect(screen.queryByTestId('mercado')).not.toBeInTheDocument();
  });

  it('renderiza Mercado cuando está autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: { id: 1, nombre: 'User', email: 'user@test.com', rol: 'user', saldo: 50000 },
      loading: false,
      verificarSesion: jest.fn(),
    });

    render(<MercadoPage />);

    expect(screen.getByTestId('mercado')).toBeInTheDocument();
    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });
});
