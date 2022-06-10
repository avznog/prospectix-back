import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { AuthService } from "./services/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
  constructor(private authService: AuthService){
    super({
      usernameField: "username"
    });
  }
    async validate(username: string, password: string): Promise<User>{
      return this.authService.getAuthenticatedUser(username, password);
    }

}