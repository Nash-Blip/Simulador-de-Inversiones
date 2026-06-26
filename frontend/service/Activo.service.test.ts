import { 
  CreateActivo, 
  ModificarActivo, 
  getListActivos, 
  getActivosPaginados, 
  getActivo,
  getActivoById, 
  comprarActivo, 
  venderActivo 
} from "./Activo.service";
import { API_URL } from "./api";
import { Activo } from '@/types/index';


const mockActivo: Activo = {
  id: 1,
  nombre: 'Bitcoin',
  ticker: 'BTC',
  precioInicial: 50000,
  precioActual: 50000,
  valorMaximo: 50000,
  valorMinimo: 50000,
  cantOperaciones: 100,
  totalEjecutado: 100000,
  transacciones: []
};

describe('Activo Service', () => {
  
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  describe('CreateActivo', () => {
    it('debería crear un activo correctamente y retornar su JSON', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockActivo),
      });

      const result = await CreateActivo('Bitcoin', 'BTC', 50000);

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/activo`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nombre: 'Bitcoin', ticker: 'BTC', precioInicial: 50000 })
      });
      expect(result).toEqual(mockActivo);
    });

    it('debería lanzar un error personalizado si la respuesta no es OK', async () => {
      const errorMessage = 'El ticker ya existe';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: errorMessage }),
      });

      await expect(CreateActivo('Bitcoin', 'BTC', 50000))
        .rejects
        .toThrow(errorMessage);
    });
  });

  describe('ModificarActivo', () => {
    it('debería modificar el activo por PATCH con la URL correcta', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ ...mockActivo, nombre: 'Bitcoin Editado' }),
      });

      const result = await ModificarActivo(1, 'Bitcoin Editado', 'BTC');

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/activo/1`, expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ nombre: 'Bitcoin Editado', ticker: 'BTC' })
      }));
      expect(result.nombre).toBe('Bitcoin Editado');
    });

    it('debería lanzar error con el mensaje del servidor si la respuesta no es OK', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: 'Activo no encontrado' }),
      });

      await expect(ModificarActivo(999, 'X', 'XYZ'))
        .rejects
        .toThrow('Activo no encontrado');
    });

    it('debería lanzar error genérico si falla y no hay mensaje en la respuesta', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({}),
      });

      await expect(ModificarActivo(1, 'X', 'XYZ'))
        .rejects
        .toThrow('Error al modificar el activo.');
    });
  });

  describe('getListActivos', () => {
    it('debería retornar el array dentro de json.data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: [mockActivo] }),
      });

      const result = await getListActivos();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/activo`, expect.objectContaining({ method: 'GET' }));
      expect(result).toEqual([mockActivo]);
    });

    it('debería lanzar error con el mensaje del servidor si la respuesta no es OK', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: 'Error interno' }),
      });

      await expect(getListActivos())
        .rejects
        .toThrow('Error interno');
    });

    it('debería lanzar error genérico si falla y no hay mensaje en la respuesta', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({}),
      });

      await expect(getListActivos())
        .rejects
        .toThrow('Error al obtener los activos.');
    });
  });

  describe('getActivosPaginados', () => {
    it('debería concatenar correctamente la query string de la página', async () => {
      const mockPaginacion = { data: [mockActivo], total: 1 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPaginacion),
      });

      const result = await getActivosPaginados(2);

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/activo?page=2`, expect.any(Object));
      expect(result).toEqual(mockPaginacion);
    });

    it('debería usar página 1 por defecto si no se pasa argumento', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: [], total: 0 }),
      });

      await getActivosPaginados();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/activo?page=1`, expect.any(Object));
    });

    it('debería incluir el parámetro search en la URL', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: [], total: 0 }),
      });

      await getActivosPaginados(1, 'amazon');

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/activo?page=1&search=amazon`, expect.any(Object));
    });

    it('debería lanzar error con el mensaje del servidor si la respuesta no es OK', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: 'Sin acceso' }),
      });

      await expect(getActivosPaginados(1))
        .rejects
        .toThrow('Sin acceso');
    });

    it('debería lanzar error genérico si falla y no hay mensaje en la respuesta', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({}),
      });

      await expect(getActivosPaginados(1))
        .rejects
        .toThrow('Error al obtener los activos existentes.');
    });
  });

  describe('getActivo', () => {
    it('debería obtener todos los activos desde /activo/list', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce([mockActivo]),
      });

      const result = await getActivo();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/activo/list`, expect.objectContaining({
        credentials: 'include',
      }));
      expect(result).toEqual([mockActivo]);
    });

    it('debería lanzar error con el mensaje del servidor si la respuesta no es OK', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: 'Error de conexión' }),
      });

      await expect(getActivo())
        .rejects
        .toThrow('Error de conexión');
    });

    it('debería lanzar error genérico si falla y no hay mensaje en la respuesta', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({}),
      });

      await expect(getActivo())
        .rejects
        .toThrow('Error al obtener los activos existentes.');
    });
  });

  describe('getActivoById', () => {
    it('debería buscar por ID y retornar el activo', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockActivo),
      });

      const result = await getActivoById(1);

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/activo/1`, expect.any(Object));
      expect(result).toEqual(mockActivo);
    });

    it('debería lanzar el mensaje genérico si falla y no hay JSON con mensaje', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getActivoById(1))
        .rejects
        .toThrow("Error al obtener activo.");
    });
  });

  describe('comprarActivo', () => {
    it('debería enviar la petición POST con el body correcto para comprar', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ success: true }),
      });

      const result = await comprarActivo(1, 5);

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/activo/comprar`, expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ activoId: 1, cantidad: 5 })
      }));
      expect(result).toEqual({ success: true });
    });

    it('debería lanzar error con el mensaje del servidor si la respuesta no es OK', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: 'Saldo insuficiente' }),
      });

      await expect(comprarActivo(1, 999))
        .rejects
        .toThrow('Saldo insuficiente');
    });

    it('debería lanzar error genérico si falla y no hay mensaje en la respuesta', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({}),
      });

      await expect(comprarActivo(1, 5))
        .rejects
        .toThrow('No se pudo comprar el Activo seleccionado.');
    });
  });

  describe('venderActivo', () => {
    it('debería extraer el id del objeto Activo pasado por parámetro', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ success: true }),
      });

      const result = await venderActivo(mockActivo, 10);

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/activo/vender`, expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ activoId: mockActivo.id, cantidad: 10 })
      }));
      expect(result).toEqual({ success: true });
    });

    it('debería lanzar error con el mensaje del servidor si la respuesta no es OK', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: 'No tienes suficientes acciones' }),
      });

      await expect(venderActivo(mockActivo, 999))
        .rejects
        .toThrow('No tienes suficientes acciones');
    });

    it('debería lanzar error genérico si falla y no hay mensaje en la respuesta', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({}),
      });

      await expect(venderActivo(mockActivo, 5))
        .rejects
        .toThrow('No se pudo vender el activo seleccionado.');
    });
  });
});
