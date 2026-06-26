import { 
  login, 
  register, 
  logout 
} from "./Auth.service"; 
import { API_URL } from "./api";

const mockUser = {
  id: 1,
  email: "test@example.com",
  username: "testuser",
};

describe("Auth Service (Frontend)", () => {
  
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  describe("login", () => {
    it("debería iniciar sesión correctamente y retornar el token y el inversor", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ accessToken: "mock-jwt-token" }),
      });

      const result = await login("alejo@example.com", "password123");

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: "alejo@example.com", password: "password123" }),
      });
      expect(result).toEqual({ accessToken: "mock-jwt-token" });
    });

    it("debería lanzar un error con el mensaje del backend si las credenciales fallan", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(login("alejo@example.com", "wrong-pass"))
        .rejects
        .toThrow("Error al logearse. Verifique los datos ingresados");
    });
  });

  describe("register", () => {
    it("debería registrar un nuevo inversor con éxito", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockUser),
      });

      const result = await register("Alejo", "Pérez", "alejo@example.com");

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/auth/register`, expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: "Alejo",
          email: "Pérez",
          password: "alejo@example.com"
        })
      }));
      expect(result).toEqual(mockUser);
    });
  });

  describe("logout", () => {
    it("debería llamar al endpoint de logout para limpiar las cookies/sesión", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const result = await logout();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/auth/logout`, expect.any(Object));
      expect(result).toBeUndefined();
    });
  });
});