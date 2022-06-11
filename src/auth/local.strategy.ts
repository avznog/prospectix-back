import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { AuthService } from "./services/auth.service";
import TokenPayload from "./interfaces/tokenPayload.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
  constructor(private authService: AuthService){
    super({
      usernameField: "username"
    });
  }
    // async validate(username: string, password: string): Promise<User>{
    //   return this.authService.getAuthenticatedUser(username, password);
    // }

    async validate(payload: TokenPayload) {
      const user = await this.authService.validateCdp(payload);
      if (!user) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      return user;
    }
}