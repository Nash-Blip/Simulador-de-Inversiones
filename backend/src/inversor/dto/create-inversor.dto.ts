import { IsNumber, IsString, ValidateNested } from "class-validator";

export class CreateInversorDto {
    @IsString()
    nombre!: string;

    @IsNumber()
    saldoVirtual!: number;
}
