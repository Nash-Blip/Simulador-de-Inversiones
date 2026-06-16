import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsNumberString, Length, IsPositive } from 'class-validator';

export class IngresarFondosTransferenciaDto {
  @ApiProperty({ example: 1000, description: 'Monto a ingresar' })
  @IsNumber()
  @IsPositive()
  monto!: number;

  @ApiProperty({ example: '0000003100000000123456', description: 'CBU de 22 dígitos' })
  @IsNumberString()
  @Length(22, 22)
  cbu!: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Titular de la cuenta' })
  @IsString()
  @IsNotEmpty()
  titular!: string;
}