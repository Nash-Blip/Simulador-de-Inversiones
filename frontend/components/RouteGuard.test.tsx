import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RouteGuard from './RouteGuard';
import { useAuth } from '@/app/auth/AuthContext';
import { InversorRol } from '@/types';

jest.mock('@/app/auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation();
});

describe('Componente RouteGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar pantalla de carga mientras se verifica la sesión', () => {
    (useAuth as jest.Mock).mockReturnValue({ inversor: null, loading: true });

    render(<RouteGuard allowedRole={InversorRol.ADMIN} redirectTo="/">contenido protegido</RouteGuard>);

    expect(screen.getByText(/cargando\.\.\./i)).toBeInTheDocument();
  });

  it('debería renderizar los children si el rol coincide', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: { id: 1, nombre: 'Admin', email: 'admin@test.com', rol: InversorRol.ADMIN, saldo: 50000 },
      loading: false,
    });

    render(<RouteGuard allowedRole={InversorRol.ADMIN} redirectTo="/">contenido protegido</RouteGuard>);

    expect(screen.getByText('contenido protegido')).toBeInTheDocument();
  });

  it('debería mostrar mensaje de redirección si el rol no coincide', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: { id: 2, nombre: 'User', email: 'user@test.com', rol: InversorRol.USER, saldo: 10000 },
      loading: false,
    });

    render(<RouteGuard allowedRole={InversorRol.ADMIN} redirectTo="/home">contenido protegido</RouteGuard>);

    expect(screen.getByText(/redirigiendo\.\.\./i)).toBeInTheDocument();
  });
});
