import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import TokenPayload from "./interfaces/tokenPayload.interface";
import { AuthService } from "./services/auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ){
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authentication;
      }]),
      secretOrKey: configService.get("JWT_ACCESS_TOKEN_SECRET")
    });
  }
  
  async validate(payload: TokenPayload) {
    const user = await this.authService.validatePm(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

}