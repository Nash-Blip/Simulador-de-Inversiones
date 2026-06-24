import { 
  CreateActivo, 
  ModificarActivo, 
  getListActivos, 
  getActivosPaginados, 
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
  
  // Limpiamos los mocks antes de cada test para que no se interfieran
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  describe('CreateActivo', () => {
    it('debería crear un activo correctamente y retornar su JSON', async () => {
      // Configuramos fetch para simular una respuesta exitosa (ok: true)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockActivo),
      });

      const result = await CreateActivo('Bitcoin', 'BTC', 50000);

      // Verificaciones
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

      // Verificamos que lance la excepción esperada
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
  });

  describe('getListActivos', () => {
    it('debería retornar el array dentro de json.data', async () => {
      // Notar que tu función desestructura retornando json.data
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: [mockActivo] }),
      });

      const result = await getListActivos();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/activo`, expect.objectContaining({ method: 'GET' }));
      expect(result).toEqual([mockActivo]);
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
  });
});