import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ProjectManagerDto } from "src/users/project-managers/dto/project-manager.dto";
import { ProjectManagersService } from "src/users/project-managers/project-managers.service";
import TokenPayload from "./interfaces/tokenPayload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly pmService: ProjectManagersService
  ){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }
  
  async validate(request: Request, payload: TokenPayload) : Promise<ProjectManagerDto>{
    const user = await this.pmService.findByPayload(payload);
    if (!user)
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    request.user = user
    return user;
  }
}