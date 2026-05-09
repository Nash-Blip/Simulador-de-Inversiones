import { CreatePortafolioDto } from "@/portafolio/dto/create-portafolio.dto";
import { Type } from "class-transformer";
import { IsNumber, IsString, ValidateNested } from "class-validator";

export class CreateInversorDto {
    @IsString()
    nombre!: string;

    @IsNumber()
    saldoVirtual!: number;

    @ValidateNested()
    @Type(() => CreatePortafolioDto)
    portafolio!: CreatePortafolioDto;
}
