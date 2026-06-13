import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateActivoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  ticker!: string;
}