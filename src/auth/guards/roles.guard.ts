import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { RolesType } from "../role.type";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<RolesType[]>("roles", context.getHandler());
    if (!roles) return false;
    const request = context.switchToHttp().getRequest();
    if(!request.user) return false;
    const role = request.user.admin ? RolesType.ADMIN : RolesType.CDP;
    return roles.includes(role);
  }
}