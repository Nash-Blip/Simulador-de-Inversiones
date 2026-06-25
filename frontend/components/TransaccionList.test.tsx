import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransaccionList from './TransaccionList';
import { getUserTransacciones } from '../service/ListTransacciones.service';

jest.mock('../service/ListTransacciones.service', () => ({
  getUserTransacciones: jest.fn(),
}));

const mockResponsePagina1 = {
  data: [
    { id: 't1', tipoTransaccion: 'COMPRA', ticker: 'AAPL', nombre: 'Apple Inc.', cantidad: 10, precioEjecutado: 1500, fecha: '2026-06-20T10:00:00.000Z' }
  ],
  meta: { totalPages: 2 }
};

const mockResponsePagina2 = {
  data: [
    { id: 't2', tipoTransaccion: 'VENTA', ticker: 'GGAL', nombre: 'Grupo Galicia', cantidad: 5, precioEjecutado: 1000, fecha: '2026-06-21T12:00:00.000Z' }
  ],
  meta: { totalPages: 2 }
};

describe('Componente TransaccionList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar la pantalla de carga e invocar la API con los filtros por defecto', async () => {
    (getUserTransacciones as jest.Mock).mockResolvedValue(mockResponsePagina1);

    render(<TransaccionList />);
    expect(screen.getByText(/cargando historial/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/cargando historial/i)).not.toBeInTheDocument();
    });

    expect(getUserTransacciones).toHaveBeenCalledWith(1, 'TODOS', '', undefined, undefined);
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText('$150.00')).toBeInTheDocument();
  });

  it('debería cambiar el filtro a COMPRA y reiniciar la página', async () => {
    (getUserTransacciones as jest.Mock).mockResolvedValue(mockResponsePagina1);

    render(<TransaccionList />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando historial/i)).not.toBeInTheDocument();
    });

    const botonCompra = screen.getByRole('button', { name: 'COMPRA' });
    fireEvent.click(botonCompra);

    await waitFor(() => {
      expect(getUserTransacciones).toHaveBeenLastCalledWith(1, 'COMPRA', '', undefined, undefined);
    });
  });

  it('debería cambiar el filtro a VENTA y reiniciar la página', async () => {
    (getUserTransacciones as jest.Mock).mockResolvedValue(mockResponsePagina1);

    render(<TransaccionList />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando historial/i)).not.toBeInTheDocument();
    });

    const botonVenta = screen.getByRole('button', { name: 'VENTA' });
    fireEvent.click(botonVenta);

    await waitFor(() => {
      expect(getUserTransacciones).toHaveBeenLastCalledWith(1, 'VENTA', '', undefined, undefined);
    });
  });

  it('debería manejar la paginación correctamente hacia adelante y atrás', async () => {
    (getUserTransacciones as jest.Mock)
      .mockResolvedValueOnce(mockResponsePagina1)
      .mockResolvedValueOnce(mockResponsePagina2);

    render(<TransaccionList />);

    await waitFor(() => {
      expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();
    });

    const botonSiguiente = screen.getByRole('button', { name: /siguiente →/i });
    fireEvent.click(botonSiguiente);

    await waitFor(() => {
      expect(getUserTransacciones).toHaveBeenLastCalledWith(2, 'TODOS', '', undefined, undefined);
      expect(screen.getByText('GGAL')).toBeInTheDocument();
      expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();
    });
  });

  it('debería buscar por texto y reiniciar la página', async () => {
    (getUserTransacciones as jest.Mock).mockResolvedValue(mockResponsePagina1);

    render(<TransaccionList />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando historial/i)).not.toBeInTheDocument();
    });

    const inputSearch = screen.getByPlaceholderText('Buscar por nombre o ticker...');
    fireEvent.change(inputSearch, { target: { value: 'AAPL' } });

    await waitFor(() => {
      expect(getUserTransacciones).toHaveBeenLastCalledWith(1, 'TODOS', 'AAPL', undefined, undefined);
    });
  });

  it('debería mostrar mensaje de tabla vacía cuando no hay transacciones', async () => {
    (getUserTransacciones as jest.Mock).mockResolvedValue({ data: [], meta: { totalPages: 1 } });

    render(<TransaccionList />);

    await waitFor(() => {
      expect(screen.getByText(/no se encontraron transacciones en tu historial/i)).toBeInTheDocument();
    });
  });

  it('debería mostrar mensaje de busqueda sin resultados', async () => {
    (getUserTransacciones as jest.Mock).mockResolvedValue({ data: [], meta: { totalPages: 1 } });

    render(<TransaccionList />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando historial/i)).not.toBeInTheDocument();
    });

    const inputSearch = screen.getByPlaceholderText('Buscar por nombre o ticker...');
    fireEvent.change(inputSearch, { target: { value: 'XYZ' } });

    await waitFor(() => {
      expect(screen.getByText(/no se encontraron transacciones que coincidan con/i)).toBeInTheDocument();
    });
  });
});
