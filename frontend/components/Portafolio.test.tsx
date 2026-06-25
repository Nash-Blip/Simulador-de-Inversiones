import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PortafolioComp from './Portafolio';
import { getPortafolio } from '../service/Inversor.service';
import { venderActivo } from '../service/Activo.service';

jest.mock('../service/Inversor.service', () => ({
  getPortafolio: jest.fn(),
}));

jest.mock('../service/Activo.service', () => ({
  venderActivo: jest.fn(),
}));

const mockPortafolio = {
  saldoVirtual: 50000,
  valorPortafolio: 75000,
  costoPortafolio: 70000,
  rendimientoPortafolio: 7.14,
  tenencias: [
    {
      activo: { id: 1, ticker: 'AAPL', nombre: 'Apple Inc.', precioActual: 150 },
      cantidad: 10,
      rendimiento: 5.5,
      precioCompra: 142.18,
    },
    {
      activo: { id: 2, ticker: 'GGAL', nombre: 'Grupo Galicia', precioActual: 200 },
      cantidad: 5,
      rendimiento: -3.2,
      precioCompra: 206.60,
    },
  ],
};

describe('Componente Portafolio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debería mostrar pantalla de carga mientras se obtienen los datos', () => {
    (getPortafolio as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<PortafolioComp />);

    expect(screen.getByText(/cargando\.\.\./i)).toBeInTheDocument();
  });

  it('debería renderizar la tabla con los datos del portafolio', async () => {
    (getPortafolio as jest.Mock).mockResolvedValue(mockPortafolio);

    render(<PortafolioComp />);

    await waitFor(() => {
      expect(screen.getByText('$50000.00')).toBeInTheDocument();
    });

    expect(screen.getByText('$75000.00')).toBeInTheDocument();
    expect(screen.getByText('$70000.00')).toBeInTheDocument();
    expect(screen.getByText('7.14%')).toBeInTheDocument();
  });

  it('debería renderizar las tarjetas de tenencia para cada activo', async () => {
    (getPortafolio as jest.Mock).mockResolvedValue(mockPortafolio);

    render(<PortafolioComp />);

    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
    });

    expect(screen.getByText('GGAL')).toBeInTheDocument();
  });

  it('debería cambiar el color del rendimiento segun sea positivo o negativo', async () => {
    (getPortafolio as jest.Mock).mockResolvedValue(mockPortafolio);

    const { container } = render(<PortafolioComp />);

    await waitFor(() => {
      expect(screen.getByText('7.14%')).toBeInTheDocument();
    });

    const celdasRendimiento = container.querySelectorAll('.text-status-success, .text-status-error');
    expect(celdasRendimiento.length).toBeGreaterThanOrEqual(1);
  });

  it('debería ejecutar la venta y mostrar el toast de éxito con el ticker', async () => {
    jest.useFakeTimers();
    (getPortafolio as jest.Mock).mockResolvedValue(mockPortafolio);
    (venderActivo as jest.Mock).mockResolvedValue(undefined);

    render(<PortafolioComp />);

    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
    });

    const botonVender = screen.getAllByRole('button', { name: /confirmar venta/i })[0];
    const inputCantidad = screen.getAllByPlaceholderText('Cantidad a vender')[0];

    fireEvent.change(inputCantidad, { target: { value: '3' } });
    fireEvent.click(botonVender);

    await waitFor(() => {
      expect(venderActivo).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/procesada/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/aapl/i).length).toBeGreaterThanOrEqual(2);

    jest.advanceTimersByTime(4000);

    await waitFor(() => {
      expect(screen.queryByText(/procesada/i)).not.toBeInTheDocument();
    });
  });

  it('debería refrescar el portafolio después de una venta exitosa', async () => {
    (getPortafolio as jest.Mock).mockResolvedValue(mockPortafolio);
    (venderActivo as jest.Mock).mockResolvedValue(undefined);

    render(<PortafolioComp />);

    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
    });

    const botonVender = screen.getAllByRole('button', { name: /confirmar venta/i })[0];
    const inputCantidad = screen.getAllByPlaceholderText('Cantidad a vender')[0];

    fireEvent.change(inputCantidad, { target: { value: '3' } });
    fireEvent.click(botonVender);

    await waitFor(() => {
      expect(getPortafolio).toHaveBeenCalledTimes(2);
    });
  });
});
