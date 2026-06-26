import { render, screen, act } from '@testing-library/react';
import { ReactNode } from 'react';
import AdminLayout from './layout';

jest.mock('@/app/auth/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/AppBarAdmin', () =>
  jest.fn(() => <div data-testid="appbar-admin">AppBarAdmin</div>)
);

jest.mock('@/components/RouteGuard', () =>
  jest.fn(({ children }: { children: ReactNode }) => <>{children}</>)
);

const { useAuth } = jest.requireMock('@/app/auth/AuthContext');

describe('AdminLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('bfcache / pageshow', () => {
    it('registra el event listener pageshow al montar', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      (useAuth as jest.Mock).mockReturnValue({
        inversor: { id: 1, rol: 'admin' },
        loading: false,
      });

      render(<AdminLayout><div>Panel</div></AdminLayout>);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'pageshow',
        expect.any(Function)
      );
    });

    it('invoca reload cuando pageshow tiene persisted=true (no-op en jsdom)', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      (useAuth as jest.Mock).mockReturnValue({
        inversor: { id: 1, rol: 'admin' },
        loading: false,
      });

      render(<AdminLayout><div>Panel</div></AdminLayout>);

      const event = new Event('pageshow');
      Object.defineProperty(event, 'persisted', { value: true });
      act(() => { window.dispatchEvent(event); });
    });

    it('limpia el event listener al desmontar', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      (useAuth as jest.Mock).mockReturnValue({
        inversor: { id: 1, rol: 'admin' },
        loading: false,
      });

      const { unmount } = render(
        <AdminLayout><div>Panel</div></AdminLayout>
      );
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'pageshow',
        expect.any(Function)
      );
    });
  });

  describe('AdminLayoutContent (a través de AdminLayout)', () => {
    it('muestra loading mientras verifica sesión', () => {
      (useAuth as jest.Mock).mockReturnValue({
        inversor: null,
        loading: true,
      });

      render(<AdminLayout><div>Panel oculto</div></AdminLayout>);

      expect(screen.getByText(/cargando/i)).toBeInTheDocument();
      expect(screen.queryByText('Panel oculto')).not.toBeInTheDocument();
    });

    it('no renderiza nada si no hay inversor (sesión expirada)', () => {
      (useAuth as jest.Mock).mockReturnValue({
        inversor: null,
        loading: false,
      });

      const { container } = render(
        <AdminLayout><div>Panel oculto</div></AdminLayout>
      );

      expect(screen.queryByText('Panel oculto')).not.toBeInTheDocument();
      expect(container.textContent).toBe('');
    });

    it('renderiza AppBarAdmin y children cuando el admin está autenticado', () => {
      (useAuth as jest.Mock).mockReturnValue({
        inversor: {
          id: 1,
          nombre: 'Admin',
          email: 'admin@mail.com',
          rol: 'admin',
          saldo: 0,
        },
        loading: false,
      });

      render(<AdminLayout><div>Panel de admin</div></AdminLayout>);

      expect(screen.getByTestId('appbar-admin')).toBeInTheDocument();
      expect(screen.getByText('Panel de admin')).toBeInTheDocument();
    });
  });
});
