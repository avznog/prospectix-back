import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    console.log(roles)
    if (!roles) return false;
    const request = context.switchToHttp().getRequest();
    console.log(request)
    if(!request.user) return false;
    const role = request.user.admin ? "Admin" : "Cdp";
    return roles.includes(role);
  }
}