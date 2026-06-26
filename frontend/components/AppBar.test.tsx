import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppBar from './AppBar';
import { ReactNode } from 'react';
import { useAuth } from '@/app/auth/AuthContext';
import { getInversor } from '@/service/Inversor.service';
import { usePathname, useRouter } from 'next/navigation';

const mockLogout = jest.fn();

const mockInversor = {
  id: 1,
  nombre: 'Alejo',
  email: 'alejo@mail.com',
  rol: 'user' as const,
  saldo: 10000,
};

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('next/link', () => {
  function MockLink({ children, href, className }: { children: ReactNode; href: string; className?: string }) {
    return <a href={href} className={className}>{children}</a>;
  }
  return MockLink;
});

jest.mock('@/app/auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/service/Inversor.service', () => ({
  getInversor: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn(), replace: jest.fn() });
  (usePathname as jest.Mock).mockReturnValue('/mercado');
  (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('AppBar', () => {
  test('muestra el estado de carga inicialmente', () => {
    (getInversor as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<AppBar />);

    expect(screen.getByText(/cargando usuario/i)).toBeInTheDocument();
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  test('carga y muestra los datos del usuario correctamente', async () => {
    (getInversor as jest.Mock).mockResolvedValue(mockInversor);

    render(<AppBar />);

    await screen.findByText(mockInversor.nombre);
    expect(screen.getByText(mockInversor.nombre[0])).toBeInTheDocument();
  });

  test('maneja error al cargar el perfil y muestra fallback', async () => {
    (getInversor as jest.Mock).mockRejectedValue(new Error('Error de red'));

    render(<AppBar />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error al obtener el perfil:", expect.any(Error));
    });

    expect(screen.getByText('U')).toBeInTheDocument();
    expect(screen.getByText('Usuario')).toBeInTheDocument();
  });

  test('renderiza todos los items del menú con sus enlaces', async () => {
    (getInversor as jest.Mock).mockResolvedValue(mockInversor);

    render(<AppBar />);
    await screen.findByText(mockInversor.nombre);

    const expectedLinks = [
      { name: /mercado/i, href: '/mercado' },
      { name: /portafolio/i, href: '/portafolio' },
      { name: /transacciones/i, href: '/transacciones' },
      { name: /fondos/i, href: '/fondos' },
      { name: /ajustes/i, href: '/ajustes' },
    ];

    expectedLinks.forEach(({ name, href }) => {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
    });
  });

  test('resalta el link activo según la ruta actual', async () => {
    (usePathname as jest.Mock).mockReturnValue('/mercado');
    (getInversor as jest.Mock).mockResolvedValue(mockInversor);

    render(<AppBar />);
    await screen.findByText(mockInversor.nombre);

    const mercadoLink = screen.getByRole('link', { name: /mercado/i });
    const portafolioLink = screen.getByRole('link', { name: /portafolio/i });

    expect(mercadoLink).toHaveClass('bg-gray-100');
    expect(portafolioLink).not.toHaveClass('bg-gray-100');
  });

  test('abre y cierra el menú hamburguesa', async () => {
    const user = userEvent.setup();
    (getInversor as jest.Mock).mockResolvedValue(mockInversor);

    const { container } = render(<AppBar />);
    await screen.findByText(mockInversor.nombre);

    const hamburger = screen.getByRole('button', { name: /abrir menú/i });
    const sidebar = container.querySelector('aside')!;

    expect(sidebar).toHaveClass('-translate-x-full');

    await user.click(hamburger);
    expect(sidebar).toHaveClass('translate-x-0');

    const overlay = container.querySelector('[class*="z-30"]');
    expect(overlay).toBeInTheDocument();
    await user.click(overlay!);

    expect(sidebar).toHaveClass('-translate-x-full');
  });

  test('cierra el menú al cambiar de ruta', async () => {
    const user = userEvent.setup();
    (getInversor as jest.Mock).mockResolvedValue(mockInversor);

    const { container, rerender } = render(<AppBar />);
    await screen.findByText(mockInversor.nombre);

    const hamburger = screen.getByRole('button', { name: /abrir menú/i });
    const sidebar = container.querySelector('aside')!;

    await user.click(hamburger);
    expect(sidebar).toHaveClass('translate-x-0');

    (usePathname as jest.Mock).mockReturnValue('/portafolio');
    rerender(<AppBar />);

    expect(sidebar).toHaveClass('-translate-x-full');
  });

  test('ejecuta logout correctamente', async () => {
    const user = userEvent.setup();
    mockLogout.mockResolvedValue(undefined);
    (getInversor as jest.Mock).mockResolvedValue(mockInversor);

    render(<AppBar />);
    await screen.findByText(mockInversor.nombre);

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('muestra mensaje de error si el logout falla', async () => {
    const user = userEvent.setup();
    mockLogout.mockRejectedValue(new Error('Error de conexión'));
    (getInversor as jest.Mock).mockResolvedValue(mockInversor);

    render(<AppBar />);
    await screen.findByText(mockInversor.nombre);

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(screen.getByText(/no se pudo conectar con el servidor/i)).toBeInTheDocument();
  });

  test('muestra el avatar con la inicial del nombre del usuario', async () => {
    (getInversor as jest.Mock).mockResolvedValue(mockInversor);

    render(<AppBar />);

    await screen.findByText(mockInversor.nombre);
    expect(screen.getByText(mockInversor.nombre[0])).toBeInTheDocument();
  });
});
