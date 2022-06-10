import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { User } from 'src/user/entities/user.entity';
import TokenPayload from '../interfaces/tokenPayload.interface';
import { LoginCdpDto } from '../dto/login-cdp.dto';
import { LdapService } from './ldap.service';
import { Cdp } from 'src/cdp/entities/cdp.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly ldapService: LdapService
    ){}

  public async getAuthenticatedUser(username: string, plainTextPassword: string): Promise<User>{
    try{
      const user = await this.userService.getByUsername(username);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    }catch (error) {
      throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST);
    }
  }

  public async login(loginCdpDto: LoginCdpDto) : Promise<string> {
    const cdp = await this.ldapService.authLdap(loginCdpDto);
    if(!cdp){
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }
    return "connectedd";
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string){
    const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
    if(!isPasswordMatching){
      throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST);
    }
  }

  public getCookieForLogOut(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  public getCookiesForLogOut(): string[] {
    return [
      "Authentication=; HttpOnly; Path=/; Max-Age=0",
      "Refresh=; HttpOnly; Path=/ Max-Age=0"
    ];
  }

  public getCookieWithJwtAccessToken(userId: number): string{
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")}`;
  }

  public getCookieWithJwtRefreshToken(userId: number){
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: `${this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME")}s`
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME")}`;
    return {cookie, token};
  }
}
