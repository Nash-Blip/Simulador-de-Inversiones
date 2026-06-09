import { IsNotEmpty, IsNumber, IsString, IsNumberString, Length, IsPositive} from 'class-validator';

export class RetirarFondosDto {
  @IsNumber()
  @IsPositive()
  monto!: number;

  @IsNumberString()
  @Length(22, 22)
  cbu!: string;

  @IsString()
  @IsNotEmpty()
  titular!: string;
}