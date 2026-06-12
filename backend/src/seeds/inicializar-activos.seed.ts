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
      {nombre: 'Amazon.com Inc.', ticker: 'AMZN', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0},
      {nombre: 'Tesla Inc.', ticker: 'TSLA', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0, cantOperaciones: 0, totalEjecutado: 0}
    ]);
    console.log('Seed de activos ejecutado con éxito.');
  }
}