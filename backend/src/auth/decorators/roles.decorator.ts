import { SetMetadata } from "@nestjs/common";
import { InversorRol } from "@/inversor/entities/inversor.entity";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: InversorRol[]) => SetMetadata(ROLES_KEY, roles);