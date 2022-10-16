import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { LoginPmDto } from '../dto/login-project-manager.dto';
import TokenPayload from '../interfaces/tokenPayload.interface';
import { LdapService } from './ldap.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly ldapService: LdapService,
  ) { }

  public async login(loginPmDto: LoginPmDto) {
    return await this.ldapService.authLdap(loginPmDto);
  }

  public refreshToken(refreshToken: string){
    const payload = this.decodeTokenWithSecurity<TokenPayload>(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
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
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`
    });
  }

  public getRefreshToken(username: string) : string {
    const payload: TokenPayload = { username };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`
    });
  }

}
