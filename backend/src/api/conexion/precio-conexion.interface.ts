export abstract class PrecioConexion {
  abstract obtenerPrecio(ticker: string): Promise<number>;
}