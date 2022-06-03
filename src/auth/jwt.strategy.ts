import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ){
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(
        request: Request) => {
        return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get("JWT_SECRET")
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.getById(payload.userId);
  }
}