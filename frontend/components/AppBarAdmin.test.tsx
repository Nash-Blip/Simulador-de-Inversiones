import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppBarAdmin from './AppBarAdmin';
import { ReactNode } from 'react';
import { useAuth } from '@/app/auth/AuthContext';
import { getPerfil } from '@/service/Inversor.service';
import { usePathname, useRouter } from 'next/navigation';

const mockLogout = jest.fn();

const mockPerfil = {
  nombre: 'Admin',
  email: 'admin@mail.com',
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
  getPerfil: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn(), replace: jest.fn() });
  (usePathname as jest.Mock).mockReturnValue('/admin/inversores');
  (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('AppBarAdmin', () => {
  test('muestra el estado de carga inicialmente', () => {
    (getPerfil as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<AppBarAdmin />);

    expect(screen.getByText(/cargando usuario/i)).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  test('carga y muestra los datos del perfil correctamente', async () => {
    (getPerfil as jest.Mock).mockResolvedValue(mockPerfil);

    render(<AppBarAdmin />);

    await screen.findByText(mockPerfil.nombre);
    expect(screen.getByText(mockPerfil.nombre[0])).toBeInTheDocument();
  });

  test('maneja error al cargar el perfil y muestra fallback', async () => {
    (getPerfil as jest.Mock).mockRejectedValue(new Error('Error de red'));

    render(<AppBarAdmin />);

    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });
  });

  test('renderiza todos los items del menú con sus enlaces', async () => {
    (getPerfil as jest.Mock).mockResolvedValue(mockPerfil);

    render(<AppBarAdmin />);
    await screen.findByText(mockPerfil.nombre);

    const expectedLinks = [
      { name: /inversores/i, href: '/admin/inversores' },
      { name: /crear activo/i, href: '/admin/activos' },
      { name: /transacciones/i, href: '/admin/transacciones' },
    ];

    expectedLinks.forEach(({ name, href }) => {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
    });
  });

  test('resalta el link activo según la ruta actual', async () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/inversores');
    (getPerfil as jest.Mock).mockResolvedValue(mockPerfil);

    render(<AppBarAdmin />);
    await screen.findByText(mockPerfil.nombre);

    const inversoresLink = screen.getByRole('link', { name: /inversores/i });
    const activoLink = screen.getByRole('link', { name: /crear activo/i });

    expect(inversoresLink).toHaveClass('bg-gray-100');
    expect(activoLink).not.toHaveClass('bg-gray-100');
  });

  test('abre y cierra el menú hamburguesa', async () => {
    const user = userEvent.setup();
    (getPerfil as jest.Mock).mockResolvedValue(mockPerfil);

    const { container } = render(<AppBarAdmin />);
    await screen.findByText(mockPerfil.nombre);

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
    (getPerfil as jest.Mock).mockResolvedValue(mockPerfil);

    const { container, rerender } = render(<AppBarAdmin />);
    await screen.findByText(mockPerfil.nombre);

    const hamburger = screen.getByRole('button', { name: /abrir menú/i });
    const sidebar = container.querySelector('aside')!;

    await user.click(hamburger);
    expect(sidebar).toHaveClass('translate-x-0');

    (usePathname as jest.Mock).mockReturnValue('/admin/activos');
    rerender(<AppBarAdmin />);

    expect(sidebar).toHaveClass('-translate-x-full');
  });

  test('ejecuta logout correctamente', async () => {
    const user = userEvent.setup();
    mockLogout.mockResolvedValue(undefined);
    (getPerfil as jest.Mock).mockResolvedValue(mockPerfil);

    render(<AppBarAdmin />);
    await screen.findByText(mockPerfil.nombre);

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('registra error en consola si el logout falla', async () => {
    const user = userEvent.setup();
    mockLogout.mockRejectedValue(new Error('Error de conexión'));
    (getPerfil as jest.Mock).mockResolvedValue(mockPerfil);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<AppBarAdmin />);
    await screen.findByText(mockPerfil.nombre);

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
  });

  test('muestra el avatar con la inicial del nombre del perfil', async () => {
    (getPerfil as jest.Mock).mockResolvedValue(mockPerfil);

    render(<AppBarAdmin />);

    await screen.findByText(mockPerfil.nombre);
    expect(screen.getByText(mockPerfil.nombre[0])).toBeInTheDocument();
  });
});
