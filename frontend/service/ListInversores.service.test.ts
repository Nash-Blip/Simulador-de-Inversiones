import { getInversores } from './ListInversores.service';
import { API_URL } from './api';

const mockInversoresLista = [
  {
    id: 1,
    nombre: "Alejo",
    email: "alejo@example.com",
    rol: "USER",
    saldoVirtual: 10000
  },
  {
    id: 2,
    nombre: "Juan Administrador",
    email: "juan@example.com",
    rol: "ADMIN",
    saldoVirtual: 50000
  }
];

describe('ListInversores Service (Frontend)', () => {

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  describe('getInversores', () => {
    it('debería retornar el array de inversores de forma exitosa', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockInversoresLista),
      });

      const result = await getInversores();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/inversor`, {
        method: 'GET',
        credentials: 'include'
      });
      expect(result).toEqual(mockInversoresLista);
      expect(result).toHaveLength(2);
    });

    it('debería capturar el mensaje dinámico del backend si la consulta falla', async () => {
      const backendError = { message: "No tienes permisos de administrador para ver esto" };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(backendError),
      });

      await expect(getInversores())
        .rejects
        .toThrow("No tienes permisos de administrador para ver esto");
    });

    it('debería usar el mensaje por defecto del front si el json devuelto no contiene un campo message', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({}),
      });

      await expect(getInversores())
        .rejects
        .toThrow("Error al obtener inversores");
    });
  });
});