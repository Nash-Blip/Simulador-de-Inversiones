import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Inversor, InversorRol } from '@/inversor/entities/inversor.entity';
import * as bcrypt from 'bcrypt';

export default class CrearAdminSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
  ): Promise<any> {
    const repository = dataSource.getRepository(Inversor);

    const count = await repository.count();
    if (count > 0) {
      console.log('El admin ya esta cargado. Saltando seed...');
      return;
    }
    const passwordHasheada = await bcrypt.hash('pruebas000', 10);
    await repository.insert([
      {
        email: "pruebasAdmin@mail.com",
        nombre: "admin",
        password: passwordHasheada,
        rol: InversorRol.ADMIN,
        saldoVirtual: 0,
        portafolio: {
          costoPortafolio: 0,
        }
      }
    ]);
    console.log('Seed de admin ejecutado con éxito.');
  }
}