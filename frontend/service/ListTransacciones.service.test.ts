import { getTransacciones, getUserTransacciones } from './ListTransacciones.service';
import { API_URL } from './api';

const mockTransaccionesResponse = {
  data: [
    { id: 1, tipoTransaccion: 'COMPRA', monto: 1500, fecha: '2026-06-24' },
    { id: 2, tipoTransaccion: 'INGRESO_TARJETA', monto: 5000, fecha: '2026-06-24' }
  ],
  meta: {
    totalItems: 2,
    itemCount: 2,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1
  }
};

describe('ListTransacciones Service', () => {

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  describe('getTransacciones', () => {
    it('debería consultar la página 1 por defecto y sin filtros adicionales', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockTransaccionesResponse),
      });

      const result = await getTransacciones();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/transaccion?page=1`, {
        credentials: 'include'
      });
      expect(result).toEqual(mockTransaccionesResponse);
    });

    it('debería concatenar correctamente la query string cuando se pasa un número de página y un filtro válido', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockTransaccionesResponse),
      });

      await getTransacciones(3, 'COMPRA');

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/transaccion?page=3&tipoTransaccion=COMPRA`, {
        credentials: 'include'
      });
    });

    it('debería ignorar el filtro si su valor es "TODOS"', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockTransaccionesResponse),
      });

      await getTransacciones(2, 'TODOS');

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/transaccion?page=2`, {
        credentials: 'include'
      });
    });

    it('debería lanzar el error fijo si response.ok es falso', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getTransacciones())
        .rejects
        .toThrow('Error al obtener transacciones');
    });
  });

  describe('getUserTransacciones', () => {
    it('debería pegar al endpoint de historial usando los valores por defecto', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockTransaccionesResponse),
      });

      const result = await getUserTransacciones();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/transaccion/historial?page=1`, {
        credentials: 'include'
      });
      expect(result).toEqual(mockTransaccionesResponse);
    });

    it('debería aplicar el filtro de tipo de transacción en la URL de historial', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockTransaccionesResponse),
      });

      await getUserTransacciones(1, 'VENTA');

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/transaccion/historial?page=1&tipoTransaccion=VENTA`, {
        credentials: 'include'
      });
    });

    it('debería lanzar el mismo error fijo si el fetch del historial falla', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getUserTransacciones())
        .rejects
        .toThrow('Error al obtener transacciones');
    });
  });
});