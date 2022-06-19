import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//       const requireRoles = this.reflector.getAllAndOverride<string[]>("roles", [
//         context.getHandler(),
//         context.getClass(),
//       ]);

//       if(!requireRoles){
//         return true;
//       }

//       const user: ProjectManager = {
//         admin: 
//       }
//   }
// }

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    console.log(roles)
    if (!roles) return false;
    const request = context.switchToHttp().getRequest();
    console.log(request)
    if(!request.user) console.log("anniversaire");
    // const role = request.user.admin ? "Admin" : "Cdp";
    const role = request.user.admin ? "Admin" : "Cdp";
    return roles.includes(role);
  }
}

// const RoleGuard = (role: string): Type<CanActivate> => {
//   class RoleGuardMixin implements CanActivate {
//     canActivate(context: ExecutionContext) {
//         const request = context.switchToHttp().getRequest<RequestWithPm>();
//         const user = request.user;
//         // return request.pm?.roles.includes(role);
//         console.log(request.pm.admin)
//         const role = request.pm.admin ? "admin" : "cdp";
//         // return request.pm.roles.includes(role)
//         return request.user?.role.includes(role);
//     }
//   }

//   return mixin(RoleGuardMixin);
// }

// export default RoleGuard;