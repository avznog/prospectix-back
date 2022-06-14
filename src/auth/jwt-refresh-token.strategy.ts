import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import TokenPayload from "./interfaces/tokenPayload.interface";
import { ProjectManagersService } from "src/project-managers/project-managers.service";
import { ProjectManager } from "src/project-managers/entities/project-manager.entity";
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh-token") {
  constructor (
    private readonly configService: ConfigService,
    private readonly pmService: ProjectManagersService

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Refresh;
      }]),
      secretOrKey: configService.get("JWT_REFRESH_TOKEN_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) : Promise<ProjectManager>{
    const refreshToken = request.cookies?.Refresh;
    return this.pmService.getPmIfRefreshTokenMatches(refreshToken, payload.username)
  }
}