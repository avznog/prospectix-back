import { Injectable } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { AuthService } from "./auth.service";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
  constructor(private authService: AuthService){
    super({
      usernameField: "username",
    });
  }
    async validate(username: string, password: string): Promise<User>{
      return this.authService.getAuthentication(username, password);
    }

}