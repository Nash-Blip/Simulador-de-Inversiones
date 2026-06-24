import { 
  getPerfil, 
  getInversor, 
  getPortafolio, 
  ingresarFondosTransferencia, 
  ingresarFondosTarjeta, 
  retirarFondos, 
  cambiarPassword 
} from './Inversor.service';
import { API_URL } from './api';

const mockPerfil = {
  nombre: "Alejo",
  email: "alejo@example.com",
  saldo: 10000
};

const mockInversor = {
  id: 1,
  email: "alejo@example.com",
  nombre: "Alejo",
  rol: "USER",
  saldoVirtual: 10000,
};

const mockPortafolio = {
  saldoVirtual: 10000,
  costoPortafolio: 1500,
  valorPortafolio: 1800,
  rendimientoPortafolio: 20,
  tenencias: []
};

describe('Inversor Service (Frontend)', () => {

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  describe('getPerfil', () => {
    it('debería retornar el perfil del inversor de manera exitosa', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPerfil),
      });

      const result = await getPerfil();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/inversor/perfil`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });
      expect(result).toEqual(mockPerfil);
    });

    it('debería lanzar un error con el mensaje de NestJS si el fetch falla', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: "No autorizado" }),
      });

      await expect(getPerfil()).rejects.toThrow("No autorizado");
    });
  });

  describe('getInversor', () => {
    it('debería consultar el mismo endpoint pero sin cabeceras JSON adicionales', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockInversor),
      });

      const result = await getInversor();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/inversor/perfil`, {
        method: 'GET',
        credentials: 'include',
      });
      expect(result).toEqual(mockInversor);
    });
  });

  describe('getPortafolio', () => {
    it('debería retornar el portafolio calculado por el backend', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPortafolio),
      });

      const result = await getPortafolio();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/inversor/portafolio`, {
        credentials: 'include',
      });
      expect(result).toEqual(mockPortafolio);
    });
  });

  describe('ingresarFondosTransferencia', () => {
    it('debería enviar un POST con los campos monto, cbu y titular', async () => {
      const mockResponse = { mensaje: 'Fondos ingresados correctamente', saldoActual: 15000 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await ingresarFondosTransferencia(5000, "23456789...", "Alejo Pérez");

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/inversor/ingresar-fondos-transferencia`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ monto: 5000, cbu: "23456789...", titular: "Alejo Pérez" })
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('ingresarFondosTarjeta', () => {
    it('debería impactar el endpoint de tarjeta con el payload de validación', async () => {
      const mockResponse = { mensaje: 'Fondos ingresados correctamente', saldoActual: 12000 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await ingresarFondosTarjeta(2000, "1234123412341234", "123", "12/28");

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/inversor/ingresar-fondos-tarjeta`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ 
          monto: 2000, 
          numeroTarjeta: "1234123412341234", 
          cvv: "123", 
          vencimiento: "12/28" 
        })
      });
      expect(result).toEqual(mockResponse);
    });

    it('debería arrojar error controlado si la tarjeta es rechazada (BadRequest en NestJS)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: "La tarjeta está vencida" }),
      });

      await expect(ingresarFondosTarjeta(2000, "1234123412341234", "123", "12/22"))
        .rejects
        .toThrow("La tarjeta está vencida");
    });
  });

  describe('retirarFondos', () => {
    it('debería solicitar la extracción de fondos de manera correcta', async () => {
      const mockResponse = { mensaje: 'Fondos retirados correctamente', saldoActual: 7000 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await retirarFondos(3000, "23456789...", "Alejo Pérez");

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/inversor/retirar-fondos`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ monto: 3000, cbu: "23456789...", titular: "Alejo Pérez" })
      });
      expect(result).toEqual(mockResponse);
    });

    it('debería manejar el error de fondos insuficientes', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: "Fondos insuficientes" }),
      });

      await expect(retirarFondos(999999, "23456789...", "Alejo Pérez"))
        .rejects
        .toThrow("Fondos insuficientes");
    });
  });

  describe('cambiarPassword', () => {
    it('debería enviar un PATCH usando passwordActual y passwordNueva como indica tu front', async () => {
      const mockResponse = { message: 'Contraseña actualizada con éxito.' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await cambiarPassword("vieja123", "nueva123");

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/inversor/cambiar-password`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passwordActual: "vieja123",
          passwordNueva: "nueva123"
        }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('debería fallar con el string incompleto del front si no viene mensaje de la API', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({}),
      });

      await expect(cambiarPassword("incorrecta", "nueva123"))
        .rejects
        .toThrow("Error al querer cambiar contraseña.");
    });
  });
});