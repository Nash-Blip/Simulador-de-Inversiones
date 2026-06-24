import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListTransaccionesAdmin from './ListTransacciones';
import { getTransacciones } from '../service/ListTransacciones.service';

// Mockeamos el servicio asincrónico
jest.mock('../service/ListTransacciones.service', () => ({
  getTransacciones: jest.fn(),
}));

describe('Componente ListTransaccionesAdmin', () => {
  const mockResponsePagina1 = {
    data: [
      { id: 't1', tipoTransaccion: 'COMPRA', ticker: 'AAPL', cantidad: 10, precioEjecutado: 1500, fecha: '2026-06-20T10:00:00.000Z' }
    ],
    meta: { totalPages: 2 }
  };

  const mockResponsePagina2 = {
    data: [
      { id: 't2', tipoTransaccion: 'VENTA', ticker: 'GGAL', cantidad: 5, precioEjecutado: 1000, fecha: '2026-06-21T12:00:00.000Z' }
    ],
    meta: { totalPages: 2 }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar la pantalla de carga e invocar la API con los filtros por defecto', async () => {
    (getTransacciones as jest.Mock).mockResolvedValue(mockResponsePagina1);

    render(<ListTransaccionesAdmin />);
    expect(screen.getByText(/cargando\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/cargando\.\.\./i)).not.toBeInTheDocument();
    });

    // Valida llamada inicial: pagina 1, filtro "TODOS"
    expect(getTransacciones).toHaveBeenCalledWith(1, 'TODOS');
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('$150.00')).toBeInTheDocument(); // precioOperado calculado (1500 / 10)
  });

  it('debería cambiar el filtro a COMPRA, resetear la página y pedir nuevos datos', async () => {
    (getTransacciones as jest.Mock).mockResolvedValue(mockResponsePagina1);

    render(<ListTransaccionesAdmin />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando\.\.\./i)).not.toBeInTheDocument();
    });

    const botonCompra = screen.getByRole('button', { name: 'COMPRA' });
    fireEvent.click(botonCompra);

    await waitFor(() => {
      // Al cambiar el filtro, re-ejecuta la API desde la página 1
      expect(getTransacciones).toHaveBeenLastCalledWith(1, 'COMPRA');
    });
  });

  it('debería manejar la paginación correctamente hacia adelante y atrás', async () => {
    // Primera llamada da la pág 1, segunda da la pág 2
    (getTransacciones as jest.Mock)
      .mockResolvedValueOnce(mockResponsePagina1)
      .mockResolvedValueOnce(mockResponsePagina2);

    render(<ListTransaccionesAdmin />);

    await waitFor(() => {
      expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();
    });

    const botonSiguiente = screen.getByRole('button', { name: /siguiente →/i });
    fireEvent.click(botonSiguiente);

    await waitFor(() => {
      expect(getTransacciones).toHaveBeenLastCalledWith(2, 'TODOS');
      expect(screen.getByText('GGAL')).toBeInTheDocument();
      expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();
    });
  });

  it('debería ejecutar el polling de refresco de datos cada 5 segundos', async () => {
    jest.useFakeTimers();
    (getTransacciones as jest.Mock).mockResolvedValue(mockResponsePagina1);

    render(<ListTransaccionesAdmin />);

    await waitFor(() => {
      expect(getTransacciones).toHaveBeenCalledTimes(1);
    });

    // Adelantamos el reloj artificialmente 5 segundos
    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(getTransacciones).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers(); // Limpiamos los timers para no afectar a otras suites
  });
});