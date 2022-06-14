import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import TokenPayload from "./interfaces/tokenPayload.interface";
import { ProjectManagerDto } from "src/project-managers/dto/project-manager.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
  constructor(private authService: AuthService){
    super({
      usernameField: "username"
    });
  }

    async validate(payload: TokenPayload) : Promise<ProjectManagerDto>{
      const user = await this.authService.validatePm(payload);
      if (!user) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      return user;
    }
}