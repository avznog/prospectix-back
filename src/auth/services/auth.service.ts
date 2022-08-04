import { HttpException, HttpStatus, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import TokenPayload from '../interfaces/tokenPayload.interface';
import { LoginPmDto } from '../dto/login-project-manager.dto';
import { LdapService } from './ldap.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly ldapService: LdapService,
  ) { }

  public async login(loginPmDto: LoginPmDto) {
    return await this.ldapService.authLdap(loginPmDto);
  }

  public refreshToken(refreshToken: string){
    const payload = this.decodeTokenWithSecurity<TokenPayload>(refreshToken, this.configService.get("JWT_REFRESH_TOKEN_SECRET"))
    return this.getAccessToken(payload.username)
  }

  private decodeTokenWithSecurity<T>(token: string, secret: string){
    if(!this.jwtService.verify(token, { secret }))
      throw new UnauthorizedException("bad refresh token")
    
    return this.jwtService.decode(token) as T
  }

  public getAccessToken(username: string): string {
    const payload: TokenPayload = { username };
    return this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
      expiresIn: `${this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")}s`
    });
  }

  public getRefreshToken(username: string) : string{
    const payload: TokenPayload = { username };
    return this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: `${this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME")}s`
    });
  }

}
