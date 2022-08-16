import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import TokenPayload from "./interfaces/tokenPayload.interface";
import { ProjectManagersService } from "src/project-managers/project-managers.service";
import { ProjectManager } from "src/project-managers/entities/project-manager.entity";
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