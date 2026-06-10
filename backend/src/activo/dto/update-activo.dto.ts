import { PartialType } from '@nestjs/mapped-types'; // o '@nestjs/swagger'
import { CreateActivoDto } from './create-activo.dto';

export class UpdateActivoDto extends PartialType(CreateActivoDto) {}