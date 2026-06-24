import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateActivos from './CreateActivos';
import { CreateActivo } from '../service/Activo.service';

const mockRouterPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockRouterPush,
    };
  },
}));

jest.mock('../service/Activo.service');

describe('Componente CreateActivos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar todos los campos del formulario e iniciar vacíos', () => {
    render(<CreateActivos />);

    expect(screen.getByRole('heading', { name: /crear activo/i })).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText('Ej: Apple Inc.')).toHaveValue('');
    expect(screen.getByPlaceholderText('Ej: AAPL')).toHaveValue('');
    expect(screen.getByPlaceholderText('Ej: 150.00')).toHaveValue('');
  });

  it('debería permitir escribir en los inputs y manejar el formateo del precio', async () => {
    render(<CreateActivos />);

    const inputNombre = screen.getByPlaceholderText('Ej: Apple Inc.');
    const inputTicker = screen.getByPlaceholderText('Ej: AAPL');
    const inputPrecio = screen.getByPlaceholderText('Ej: 150.00');

    await userEvent.type(inputNombre, 'Tesla Inc.');
    await userEvent.type(inputTicker, 'TSLA');
    
    fireEvent.change(inputPrecio, { target: { value: '250.50' } });

    expect(inputNombre).toHaveValue('Tesla Inc.');
    expect(inputTicker).toHaveValue('TSLA');
    expect(inputPrecio).toHaveValue('250.5');
  });

  it('debería limpiar el formulario por completo al hacer clic en Restablecer', async () => {
    render(<CreateActivos />);

    const inputNombre = screen.getByPlaceholderText('Ej: Apple Inc.');
    const inputTicker = screen.getByPlaceholderText('Ej: AAPL');
    const inputPrecio = screen.getByPlaceholderText('Ej: 150.00');
    const botonReset = screen.getByRole('button', { name: /restablecer/i });

    // Llenamos campos
    await userEvent.type(inputNombre, 'Microsoft');
    await userEvent.type(inputTicker, 'MSFT');
    await userEvent.type(inputPrecio, '300');

    // Reseteamos
    await userEvent.click(botonReset);

    // Deben volver a su estado inicial
    expect(inputNombre).toHaveValue('');
    expect(inputTicker).toHaveValue('');
    expect(inputPrecio).toHaveValue('');
  });

  it('debería crear el activo con éxito, mostrar mensaje y redirigir al listado', async () => {
    (CreateActivo as jest.Mock).mockResolvedValueOnce(undefined);

    render(<CreateActivos />);

    const inputNombre = screen.getByPlaceholderText('Ej: Apple Inc.');
    const inputTicker = screen.getByPlaceholderText('Ej: AAPL');
    const inputPrecio = screen.getByPlaceholderText('Ej: 150.00');
    const botonSubmit = screen.getByRole('button', { name: 'Crear activo' });

    await userEvent.type(inputNombre, 'Google');
    await userEvent.type(inputTicker, 'GOOGL');
    
    fireEvent.change(inputPrecio, { target: { value: '120.75' } });

    await userEvent.click(botonSubmit);

    expect(CreateActivo).toHaveBeenCalledWith('Google', 'GOOGL', 120.75);

    await waitFor(() => {
      expect(screen.getByText('Activo creado con éxito.')).toBeInTheDocument();
    });

    expect(mockRouterPush).toHaveBeenCalledWith('/admin/transacciones');
  });

  it('debería mostrar un mensaje de error si el servicio CreateActivo falla', async () => {
    const errorMessage = 'El ticker ya se encuentra registrado';
    (CreateActivo as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<CreateActivos />);

    const inputNombre = screen.getByPlaceholderText('Ej: Apple Inc.');
    const inputTicker = screen.getByPlaceholderText('Ej: AAPL');
    const inputPrecio = screen.getByPlaceholderText('Ej: 150.00');
    const botonSubmit = screen.getByRole('button', { name: 'Crear activo' });

    await userEvent.type(inputNombre, 'Google');
    await userEvent.type(inputTicker, 'GOOGL');
    await userEvent.type(inputPrecio, '120');

    await userEvent.click(botonSubmit);


    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockRouterPush).not.toHaveBeenCalled();
  });
});