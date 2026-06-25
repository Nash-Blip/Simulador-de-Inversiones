import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavBar from './NavBar';
import { ReactNode } from 'react';
import { useAuth } from '@/app/auth/AuthContext';

const mockLogout = jest.fn();

const mockUser = {
  id: 1,
  nombre: 'Alejo',
  email: 'alejo@mail.com',
  rol: 'user',
  saldo: 10000,
};

const mockAdmin = {
  id: 2,
  nombre: 'Admin',
  email: 'admin@mail.com',
  rol: 'admin',
  saldo: 50000,
};

jest.mock('@/app/auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/link', () => {
  function MockLink({
    children,
    href,
  }: {
    children: ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  }

  return MockLink;
});

describe('NavBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra Login y Registro cuando no hay usuario', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: null,
      loading: false,
      logout: mockLogout,
    });

    render(<NavBar />);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/registro/i)).toBeInTheDocument();
  });

  test('muestra cargando mientras verifica la sesión', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: null,
      loading: true,
      logout: mockLogout,
    });

    render(<NavBar />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  test('muestra opciones de usuario autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: mockUser,
      loading: false,
      logout: mockLogout,
    });

    render(<NavBar />);

    expect(screen.getByText(/ir al simulador/i)).toBeInTheDocument();
    expect(screen.getByText(/cerrar sesión/i)).toBeInTheDocument();
  });

  test('link apunta a mercado para usuario normal', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: mockUser,
      loading: false,
      logout: mockLogout,
    });

    render(<NavBar />);

    expect(
      screen.getByRole('link', {
        name: /ir al simulador/i,
      })
    ).toHaveAttribute('href', '/mercado');
  });

  test('link apunta a admin para administrador', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: mockAdmin,
      loading: false,
      logout: mockLogout,
    });

    render(<NavBar />);

    expect(
      screen.getByRole('link', {
        name: /ir al simulador/i,
      })
    ).toHaveAttribute('href', '/admin/inversores');
  });

  test('ejecuta logout al hacer click en cerrar sesión', async () => {
    const user = userEvent.setup();

    (useAuth as jest.Mock).mockReturnValue({
      inversor: mockAdmin,
      loading: false,
      logout: mockLogout,
    });

    render(<NavBar />);

    await user.click(
      screen.getByRole('button', {
        name: /cerrar sesión/i,
      })
    );

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('renderiza el botón hamburguesa', () => {
    (useAuth as jest.Mock).mockReturnValue({
      inversor: null,
      loading: false,
      logout: mockLogout,
    });

    render(<NavBar />);

    expect(
      screen.getByRole('button', {
        name: /toggle menu/i,
      })
    ).toBeInTheDocument();
  });
});