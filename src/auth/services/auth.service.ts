import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { User } from 'src/user/entities/user.entity';
import TokenPayload from '../interfaces/tokenPayload.interface';
import { LoginCdpDto } from '../dto/login-cdp.dto';
import { LdapService } from './ldap.service';
import { Cdp } from 'src/cdp/entities/cdp.entity';
import { CdpDto } from 'src/cdp/dto/cdp.dto';
import RequestWithUser from '../interfaces/requestWithCdp.interface';
import { CdpService } from 'src/cdp/cdp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly ldapService: LdapService,
    private readonly cdpService: CdpService
    ){}

  public async login(loginCdpDto: LoginCdpDto, @Req() request: RequestWithUser) : Promise<string> {
    const cdp = await this.ldapService.authLdap(loginCdpDto);
    if(!cdp){
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }

    const user = new CdpDto()
    user.username = loginCdpDto.username;
    const accessTokenCookie = this.getCookieWithJwtAccessToken(user.username);
    const {cookie: refreshTokenCookie,token: refreshToken} = this.getCookieWithJwtRefreshToken(user.username);
    await this.cdpService.setCurrentRefreshToken(refreshToken, user.username);
    request.res?.setHeader("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);
    return "connectedd";
  }


  async validateCdp(payload: TokenPayload): Promise<Cdp> {
    const cdp = await this.cdpService.findByPayload(payload);
    if (!cdp) throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

    return cdp;
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

  public getCookieWithJwtAccessToken(username: string): string{
    const payload: TokenPayload = { username };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")}`;
  }

  public getCookieWithJwtRefreshToken(username: string){
    const payload: TokenPayload = { username };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: `${this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME")}s`
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME")}`;
    return {cookie, token};
  }
}
