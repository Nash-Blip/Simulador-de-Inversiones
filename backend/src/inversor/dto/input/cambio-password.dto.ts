import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CambioPasswordDto {
  @ApiProperty({ example: 'vieja123', description: 'Contraseña actual' })
  @IsString()
  @IsNotEmpty()
  passwordActual!: string;

  @ApiProperty({ example: 'nueva456', description: 'Contraseña nueva (mín. 6 caracteres)' })
  @IsString()
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres.' })
  passwordNueva!: string;
}