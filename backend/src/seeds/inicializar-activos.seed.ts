import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Activo } from '@/activo/entities/activo.entity';

export default class InicializarActivosSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<any> {
    const repository = dataSource.getRepository(Activo);

    const count = await repository.count();
    if (count > 0) {
      console.log('Activos ya cargados. Saltando seed...');
      return;
    }

    await repository.insert([
      {nombre: 'Apple Inc.', ticker: 'AAPL', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Microsoft Corporation', ticker: 'MSFT', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'NVIDIA Corporation', ticker: 'NVDA', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Amazon Inc.', ticker: 'AMZN', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Google', ticker: 'GOOGL', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Meta Platforms', ticker: 'META', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Netflix', ticker: 'NFLX', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Intel Corp.', ticker: 'INTC', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Advanced Micro Devices', ticker: 'AMD', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Tesla Inc.', ticker: 'TSLA', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'McDonalds', ticker: 'MCD', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Nike Inc.', ticker: 'NKE', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'The Walt Disney Company', ticker: 'DIS', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Coca-Cola Company', ticker: 'KO', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'PepsiCo Inc.', ticker: 'PEP', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Visa Inc.', ticker: 'V', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Walmart Inc.', ticker: 'WMT', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Pfizer Inc.', ticker: 'PFE', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Chevron Corporation', ticker: 'CVX', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Exxon Mobil Corporation', ticker: 'XOM', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0}
    ]);
    console.log('Seed de activos ejecutado con éxito.');
  }
}