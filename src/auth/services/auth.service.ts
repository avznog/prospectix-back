import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import TokenPayload from '../interfaces/tokenPayload.interface';
import { LoginPmDto } from '../dto/login-project-manager.dto';
import { LdapService } from './ldap.service';
import { ProjectManagersService } from 'src/project-managers/project-managers.service';
import { ProjectManagerDto } from 'src/project-managers/dto/project-manager.dto';
import RequestWithPm from '../interfaces/requestWithPm.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly ldapService: LdapService,
    private readonly pmService: ProjectManagersService,

    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>
    ){}

  public async login(loginPmDto: LoginPmDto, @Req() request: RequestWithPm) : Promise<ProjectManager> {
    const pm = await this.ldapService.authLdap(loginPmDto);
    if(!pm){
      throw new HttpException("Vos identifiants LDAP sont corrects, mais vous n'avez pas encore de compte Prospectix", HttpStatus.UNAUTHORIZED );
    }
    const user = new ProjectManagerDto()
    user.pseudo = loginPmDto.username;
    const accessTokenCookie = this.getCookieWithJwtAccessToken(user.pseudo);
    const {cookie: refreshTokenCookie,token: refreshToken} = this.getCookieWithJwtRefreshToken(user.pseudo);
    await this.pmService.setCurrentRefreshToken(refreshToken, user.pseudo);
    request.res?.setHeader("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);
    return await this.pmRepository.findOne({
      where: {
        pseudo : loginPmDto.username
      }
    });
  }


  async validatePm(payload: TokenPayload): Promise<ProjectManagerDto> {
    const pm = await this.pmService.findByPayload(payload);
    this.pmService.getPmIfRefreshTokenMatches(pm.currentHashedRefreshToken, pm.pseudo);
    if (!pm) 
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

    return pm;
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
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`;
  }

  public getCookieWithJwtRefreshToken(username: string){
    const payload: TokenPayload = { username };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: `${this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME")}s`
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;
    return {cookie, token};
  }

}
