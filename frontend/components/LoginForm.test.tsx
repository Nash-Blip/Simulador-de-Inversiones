import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';
import { login } from '../service/Auth.service';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../service/Auth.service', () => ({
  login: jest.fn(),
}));

describe('Componente LoginForm', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('debería renderizar los campos de texto del formulario correctamente', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesion/i })).toBeInTheDocument();
  });

  it('debería redirigir a /admin/inversores si el usuario es administrador', async () => {
    (login as jest.Mock).mockResolvedValue({
      inversor: { rol: 'admin' },
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesion/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('admin@test.com', 'admin123');
      expect(mockPush).toHaveBeenCalledWith('/admin/inversores');
    });
  });

  it('debería redirigir a /mercado si el usuario es un inversor regular', async () => {
    (login as jest.Mock).mockResolvedValue({
      inversor: { rol: 'user' },
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'user123' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesion/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('user@test.com', 'user123');
      expect(mockPush).toHaveBeenCalledWith('/mercado');
    });
  });

  it('debería mostrar un mensaje de error si las credenciales fallan', async () => {
    (login as jest.Mock).mockRejectedValue(new Error('Unauthorized'));
    const spyConsole = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'error@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'claveInvalida' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesion/i }));

    await waitFor(() => {
      expect(screen.getByText(/cuenta o contraseña incorrecta/i)).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
    spyConsole.mockRestore();
  });
});