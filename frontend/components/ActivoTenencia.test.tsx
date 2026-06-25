import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ActivoTenencia } from './ActivoTenencia';
import { Activo } from "@/types/index";

const mockActivo: Activo = {
  id: 1,
  ticker: "AAPL",
  nombre: "Apple Inc.",
  precioActual: 150.00,
} as Activo;

const mockTenenciaBase = {
  activo: mockActivo,
  cantidad: 10,
  rendimiento: 5.5,
  precioCompra: 142.18
};

describe('Componente ActivoTenencia', () => {
  const mockOnVender = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar correctamente todos los datos del activo', () => {
    render(<ActivoTenencia tenencia={mockTenenciaBase} onVender={mockOnVender} />);

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5.5%')).toBeInTheDocument();
    expect(screen.getByText('Precio Actual: $150.00')).toBeInTheDocument();
    expect(screen.getByText('PPC: $142.18')).toBeInTheDocument();
    expect(screen.getByText('Total Tenencia: $1500.00')).toBeInTheDocument();
  });

  it('debería pintar el rendimiento de verde si es positivo y de rojo si es negativo', () => {
    const { rerender } = render(
      <ActivoTenencia tenencia={mockTenenciaBase} onVender={mockOnVender} />
    );
    expect(screen.getByText('5.5%')).toHaveClass('text-green-500');

    const tenenciaNegativa = { ...mockTenenciaBase, rendimiento: -3.2 };
    rerender(<ActivoTenencia tenencia={tenenciaNegativa} onVender={mockOnVender} />);
    expect(screen.getByText('-3.2%')).toHaveClass('text-red-500');
  });

  it('debería mostrar un error si se intenta vender una cantidad igual o menor a 0', async () => {
    render(<ActivoTenencia tenencia={mockTenenciaBase} onVender={mockOnVender} />);
    
    const botonConfirmar = screen.getByRole('button', { name: /confirmar venta/i });
    await userEvent.click(botonConfirmar);

    expect(screen.getByText('Ingresá una cantidad válida mayor a 0.')).toBeInTheDocument();
    expect(mockOnVender).not.toHaveBeenCalled();
  });

  it('debería mostrar un error si la cantidad a vender supera la cantidad disponible', async () => {
    render(<ActivoTenencia tenencia={mockTenenciaBase} onVender={mockOnVender} />);
    
    const input = screen.getByPlaceholderText('Cantidad a vender');
    const botonConfirmar = screen.getByRole('button', { name: /confirmar venta/i });

    await userEvent.type(input, '12');
    await userEvent.click(botonConfirmar);

    expect(screen.getByText('No podés vender más de la cantidad adquirida.')).toBeInTheDocument();
    expect(screen.getByText('$ -')).toBeInTheDocument();
    expect(mockOnVender).not.toHaveBeenCalled();
  });

  it('debería calcular el total a vender dinámicamente y ejecutar onVender con datos válidos', async () => {
    render(<ActivoTenencia tenencia={mockTenenciaBase} onVender={mockOnVender} />);
    
    const input = screen.getByPlaceholderText('Cantidad a vender');
    const botonConfirmar = screen.getByRole('button', { name: /confirmar venta/i });

    await userEvent.type(input, '5');
    
    expect(screen.getByText('$750.00')).toBeInTheDocument();

    await userEvent.click(botonConfirmar);

    expect(screen.queryByText('Ingresá una cantidad válida mayor a 0.')).not.toBeInTheDocument();
    expect(mockOnVender).toHaveBeenCalledWith(mockActivo, 5);
  });

  it('debería resetear la cantidad a 0 si la cantidad de la tenencia cambia desde afuera (useEffect)', () => {
    const { rerender } = render(
      <ActivoTenencia tenencia={mockTenenciaBase} onVender={mockOnVender} />
    );

    const input = screen.getByPlaceholderText('Cantidad a vender') as HTMLInputElement;
    userEvent.type(input, '4');

    const nuevaTenencia = { ...mockTenenciaBase, cantidad: 8 };
    rerender(<ActivoTenencia tenencia={nuevaTenencia} onVender={mockOnVender} />);

    expect(input.value).toBe('');
  });
});