import { IsNotEmpty, IsNumber, IsString, Min, IsNumberString, Length } from 'class-validator';

export class IngresarFondosTransferenciaDto {

  @IsNumber()
  @Min(1)
  monto!: number;

  @IsNumberString()
  @Length(22, 22)
  cbu!: string;

  @IsString()
  @IsNotEmpty()
  titular!: string;
}