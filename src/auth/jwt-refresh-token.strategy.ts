import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import TokenPayload from "./interfaces/tokenPayload.interface";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/services/user.service";
import { AuthService } from "./services/auth.service";
import { CdpService } from "src/cdp/cdp.service";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh-token") {
  constructor (
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cdpService: CdpService

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Refresh;
      }]),
      secretOrKey: configService.get("JWT_REFRESH_TOKEN_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;
    return this.cdpService.getCdpIfRefreshTokenMatches(refreshToken, payload.username)
  }
}