import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InversorProfile from './InversorProfile';
import { getPerfil, cambiarPassword } from '../service/Inversor.service';

jest.mock('../service/Inversor.service', () => ({
  getPerfil: jest.fn(),
  cambiarPassword: jest.fn(),
}));

describe('Componente InversorProfile', () => {
  const mockPerfil = {
    nombre: 'Alejo',
    email: 'alejo@inversiones.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar el estado de carga al inicializar', () => {
    (getPerfil as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<InversorProfile />);
    expect(screen.getByText(/cargando ajustes\.\.\./i)).toBeInTheDocument();
  });

  it('debería renderizar la data del perfil correctamente tras la carga', async () => {
    (getPerfil as jest.Mock).mockResolvedValue(mockPerfil);
    render(<InversorProfile />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando ajustes\.\.\./i)).not.toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { level: 1, name: /ajustes de cuenta/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Alejo' })).toBeInTheDocument();
    expect(screen.getByText('alejo@inversiones.com')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('debería mostrar un error si las nuevas contraseñas no coinciden', async () => {
    (getPerfil as jest.Mock).mockResolvedValue(mockPerfil);
    render(<InversorProfile />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando ajustes\.\.\./i)).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'actual123' } });
    fireEvent.change(screen.getByPlaceholderText('Mínimo 6 caracteres'), { target: { value: 'nueva123' } });
    fireEvent.change(screen.getByPlaceholderText('Repetí tu nueva contraseña'), { target: { value: 'diferente123' } });

    fireEvent.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

    expect(screen.getByText(/la nueva contraseña y la confirmación no coinciden/i)).toBeInTheDocument();
    expect(cambiarPassword).not.toHaveBeenCalled();
  });

  it('debería mostrar un error si la contraseña nueva tiene menos de 6 caracteres', async () => {
    (getPerfil as jest.Mock).mockResolvedValue(mockPerfil);
    render(<InversorProfile />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando ajustes\.\.\./i)).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'actual123' } });
    fireEvent.change(screen.getByPlaceholderText('Mínimo 6 caracteres'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Repetí tu nueva contraseña'), { target: { value: '123' } });

    fireEvent.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

    expect(screen.getByText(/la nueva contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
  });

  it('debería procesar el cambio de contraseña con éxito y limpiar los inputs', async () => {
    (getPerfil as jest.Mock).mockResolvedValue(mockPerfil);
    (cambiarPassword as jest.Mock).mockResolvedValue({});
    render(<InversorProfile />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando ajustes\.\.\./i)).not.toBeInTheDocument();
    });

    const inputActual = screen.getByPlaceholderText('••••••••');
    const inputNueva = screen.getByPlaceholderText('Mínimo 6 caracteres');
    const inputConfirma = screen.getByPlaceholderText('Repetí tu nueva contraseña');

    fireEvent.change(inputActual, { target: { value: 'passwordVieja1' } });
    fireEvent.change(inputNueva, { target: { value: 'superPassword2' } });
    fireEvent.change(inputConfirma, { target: { value: 'superPassword2' } });

    fireEvent.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

    await waitFor(() => {
      expect(screen.getByText(/contraseña actualizada correctamente/i)).toBeInTheDocument();
    });

    expect(cambiarPassword).toHaveBeenCalledWith('passwordVieja1', 'superPassword2');
    
    expect(inputActual).toHaveValue('');
    expect(inputNueva).toHaveValue('');
    expect(inputConfirma).toHaveValue('');
  });
});