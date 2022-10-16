import { SetMetadata } from "@nestjs/common";
import { RolesType } from "../role.type";

export const Roles = (...roles: RolesType[]) => SetMetadata('roles', roles);