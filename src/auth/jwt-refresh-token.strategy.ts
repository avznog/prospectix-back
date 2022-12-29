import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ProjectManager } from "src/entities/project-managers/project-manager.entity";
import { ProjectManagersService } from "src/services/project-managers/project-managers.service";
import TokenPayload from "./interfaces/tokenPayload.interface";
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh-token") {
  constructor (
    private readonly pmService: ProjectManagersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.["refresh-token"];
      }]),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) : Promise<ProjectManager>{
    return this.pmService.findByPayload(payload)
  }
}