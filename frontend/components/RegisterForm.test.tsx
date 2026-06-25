import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from './RegisterForm';
import { register, login } from '../service/Auth.service';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../service/Auth.service', () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

describe('Componente RegisterForm', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('debería renderizar los campos del formulario de registro', () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText('Nombre completo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  it('debería registrar, iniciar sesión automáticamente y redirigir al mercado', async () => {
    (register as jest.Mock).mockResolvedValue(undefined);
    (login as jest.Mock).mockResolvedValue({ inversor: { rol: 'user' } });

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Juan Perez' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith('Juan Perez', 'juan@test.com', 'pass123');
      expect(login).toHaveBeenCalledWith('juan@test.com', 'pass123');
      expect(mockPush).toHaveBeenCalledWith('/mercado');
    });
  });

  it('debería mostrar mensaje de error si el registro falla', async () => {
    (register as jest.Mock).mockRejectedValue(new Error('El email ya está registrado.'));

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Juan Perez' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'existente@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(screen.getByText(/el email ya está registrado/i)).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
