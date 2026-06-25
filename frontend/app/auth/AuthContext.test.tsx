import { render, screen, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from './AuthContext';

jest.mock('@/service/Auth.service', () => ({
  logout: jest.fn(),
}));

const { logout: apiLogout } = jest.requireMock('@/service/Auth.service');

function TestConsumer() {
  const { inversor, loading, verificarSesion, logout } = useAuth();
  return (
    <div>
      <p data-testid="loading">{loading ? 'true' : 'false'}</p>
      <p data-testid="inversor">{inversor ? 'logged' : 'null'}</p>
      <button data-testid="verificar" onClick={() => verificarSesion()}>Verificar</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('AuthContext', () => {
  describe('AuthProvider — montaje inicial', () => {
    it('comienza con loading=true y sin inversor', () => {
      global.fetch = jest.fn().mockImplementation(() => new Promise(() => {}));

      renderWithProvider();

      expect(screen.getByTestId('loading').textContent).toBe('true');
      expect(screen.getByTestId('inversor').textContent).toBe('null');
    });

    it('llama a fetch("/inversor/perfil") al montar', () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 });

      renderWithProvider();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/inversor/perfil',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
    });
  });

  describe('Respuestas del servidor', () => {
    it('status 200: establece inversor y loading=false', async () => {
      const mockInversor = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'user', saldo: 10000 };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockInversor,
      });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      expect(screen.getByTestId('inversor').textContent).toBe('logged');
    });

    it('status 401: inversor=null y loading=false', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
      });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      expect(screen.getByTestId('inversor').textContent).toBe('null');
    });

    it('error de red: inversor=null y loading=false', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      expect(screen.getByTestId('inversor').textContent).toBe('null');
    });
  });

  describe('Evento pageshow (bfcache)', () => {
    it('registra event listener pageshow al montar', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      global.fetch = jest.fn().mockImplementation(() => new Promise(() => {}));

      renderWithProvider();

      expect(addEventListenerSpy).toHaveBeenCalledWith('pageshow', expect.any(Function));
    });

    it('remueve event listener al desmontar', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      global.fetch = jest.fn().mockImplementation(() => new Promise(() => {}));

      const { unmount } = renderWithProvider();
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('pageshow', expect.any(Function));
    });

    it('con persisted=true: setea loading=true y llama a verificarSesion de nuevo', async () => {
      const mockInversor = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'user', saldo: 10000 };
      const fetchSpy = jest.spyOn(global, 'fetch')
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockInversor,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });

      const event = new Event('pageshow');
      Object.defineProperty(event, 'persisted', { value: true });
      act(() => { window.dispatchEvent(event); });

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
  });
});

describe('logout', () => {
  it('llama a apiLogout y setea inversor=null', async () => {
    const mockInversor = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'user', saldo: 10000 };
    const fetchSpy = jest.spyOn(global, 'fetch')
      .mockResolvedValue({ ok: true, status: 200, json: async () => mockInversor });

    jest.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('inversor').textContent).toBe('logged');
    });

    const logoutBtn = screen.getByRole('button', { name: 'Logout' });
    act(() => { logoutBtn.click(); });

    await waitFor(() => {
      expect(apiLogout).toHaveBeenCalled();
    });
    expect(screen.getByTestId('inversor').textContent).toBe('null');

    fetchSpy.mockRestore();
  });
});

describe('useAuth', () => {
  it('retorna valores por defecto fuera del provider', () => {
    const originalError = console.error;
    console.error = jest.fn();

    function Test() {
      const auth = useAuth();
      return <p data-testid="default">{`${auth.loading}`}</p>;
    }

    render(<Test />);
    expect(screen.getByTestId('default').textContent).toBe('true');

    console.error = originalError;
  });
});
