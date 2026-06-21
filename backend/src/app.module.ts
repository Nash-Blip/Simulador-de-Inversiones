import { Module } from '@nestjs/common';
import { InversorModule } from './inversor/inversor.module';
import { ActivoModule } from './activo/activo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SimuladorModule } from './simulador/simulador.module';
import { FinnhubModule } from './api/sincronizacion-precios.module';
import { TransaccionModule } from './transaccion/transaccion.module';
import CrearAdminSeeder from './seeds/crear-admin.seed';
import InicializarActivosSeeder from './seeds/inicializar-activos.seed';

@Module({
  imports: [
    InversorModule,
    ActivoModule, 
    TransaccionModule,
    AuthModule, 
    SimuladorModule,
    FinnhubModule,
    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        seeds: [CrearAdminSeeder,InicializarActivosSeeder],
      }),
    }),
  ]
})
export class AppModule {}
