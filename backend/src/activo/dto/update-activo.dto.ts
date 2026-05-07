import { PartialType } from '@nestjs/mapped-types';
import { CreateActivoDto } from './create-activo.dto';
import { IsString } from 'class-validator';

export class UpdateActivoDto extends PartialType(CreateActivoDto) {
    
    @IsString()
    nombre?: string;

    @IsString()
    simbolo?: string;
}
