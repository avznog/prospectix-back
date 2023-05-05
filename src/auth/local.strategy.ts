import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { ProjectManagerDto } from "src/users/project-managers/dto/project-manager.dto";
import { ProjectManagersService } from "src/users/project-managers/project-managers.service";
import TokenPayload from "./interfaces/tokenPayload.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
  constructor(private pmService: ProjectManagersService){
    super({
      usernameField: "username"
    });
  }

  async validate(payload: TokenPayload) : Promise<ProjectManagerDto>{
    const user = await this.pmService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}