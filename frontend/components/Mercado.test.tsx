import { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Mercado from './Mercado';
import { getActivosPaginados, comprarActivo } from '../service/Activo.service';
import { getInversor } from '../service/Inversor.service';


jest.mock('next/dynamic', () => () => {
  const MockGrafico = () => <div data-testid="mock-grafico">Grafico Renderizado</div>;
  return MockGrafico;
});


jest.mock('../service/Activo.service', () => ({
  getActivosPaginados: jest.fn(),
  comprarActivo: jest.fn(),
}));

jest.mock('../service/Inversor.service', () => ({
  getInversor: jest.fn(),
}));

describe('Componente Mercado', () => {
  const mockActivosResponse = {
    data: [
      { id: 'a1', ticker: 'AAPL', nombre: 'Apple Inc.', precioActual: 150.0, precioInicial: 140.0, valorMaximo: 155.0, valorMinimo: 138.0, cantOperaciones: 25, totalEjecutado: 3750.0 },
      { id: 'a2', ticker: 'TSLA', nombre: 'Tesla Motors', precioActual: 200.0, precioInicial: 210.0, valorMaximo: 220.0, valorMinimo: 195.0, cantOperaciones: 40, totalEjecutado: 8000.0 }
    ],
    meta: { totalPages: 1 }
  };

  const mockInversor = { id: 'i1', nombre: 'Inversor Test', saldo: 5000.0 };

  beforeEach(() => {
    jest.clearAllMocks();
    (getActivosPaginados as jest.Mock).mockResolvedValue(mockActivosResponse);
    (getInversor as jest.Mock).mockResolvedValue(mockInversor);
  });

  it('debería renderizar la lista de activos y calcular el rendimiento correctamente', async () => {
    render(<Mercado />);

    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      expect(screen.getByText('TSLA')).toBeInTheDocument();
    });


    expect(screen.getByText('+7.14%')).toBeInTheDocument();
    expect(screen.getByText('-4.76%')).toBeInTheDocument();
  });

  it('debería abrir el panel lateral al seleccionar un activo y mostrar el gráfico mockeado', async () => {
    render(<Mercado />);

    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('AAPL'));

    expect(screen.getByText('Saldo disponible:')).toBeInTheDocument();
    expect(screen.getByText('$5000.00')).toBeInTheDocument();
    expect(screen.getByTestId('mock-grafico')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar compra/i })).toBeInTheDocument();
  });

  it('debería procesar una compra exitosa, actualizar saldo y mostrar el toast temporal', async () => {
    jest.useFakeTimers();
    (comprarActivo as jest.Mock).mockResolvedValue({ OK: true });

    render(<Mercado />);

    await waitFor(() => { fireEvent.click(screen.getByText('AAPL')); });

    const inputCantidad = screen.getByLabelText(/cantidad a comprar/i);
    fireEvent.change(inputCantidad, { target: { value: '2' } });

  
    expect(screen.getByText('$300.00')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /confirmar compra/i }));

    await waitFor(() => {
      expect(comprarActivo).toHaveBeenCalledWith('a1', 2);
      expect(screen.getByText(/¡tu orden de compra de/i)).toBeInTheDocument();
    });

    await act(async () => {
      jest.advanceTimersByTime(4000);
    });

    expect(screen.queryByText(/¡tu orden de compra de/i)).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('debería mostrar un mensaje de error si la compra falla por saldo insuficiente', async () => {
    jest.useFakeTimers();
    (comprarActivo as jest.Mock).mockRejectedValue(new Error('Insufficient funds'));

    render(<Mercado />);

    await waitFor(() => { fireEvent.click(screen.getByText('AAPL')); });
    
    fireEvent.click(screen.getByRole('button', { name: /confirmar compra/i }));

    await waitFor(() => {
      expect(screen.getByText(/no tenés saldo suficiente para comprar/i)).toBeInTheDocument();
    });

    await act(async () => {
      jest.advanceTimersByTime(4000);
    });

    jest.useRealTimers();
  });

  it('debería bloquear el botón de compra si la cantidad ingresada supera el máximo de 1000', async () => {
    render(<Mercado />);

    await waitFor(() => { fireEvent.click(screen.getByText('AAPL')); });

    const inputCantidad = screen.getByLabelText(/cantidad a comprar/i);
    fireEvent.change(inputCantidad, { target: { value: '1500' } });

    expect(screen.getByText(/\* Supera el máximo permitido por operación/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar compra/i })).toBeDisabled();
  });
});