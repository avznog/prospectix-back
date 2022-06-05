import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { User } from 'src/user/entities/user.entity';
import TokenPayload from './tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
    ){}

  public async register(registrationData: RegisterDto): Promise<User>{
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try{
      const createdUser = await this.userService.create({
        ...registrationData,
        password: hashedPassword
      });
      createdUser.password = undefined;
      return createdUser;
    }catch (error){

      if(error?.code === "23505"){
        throw new HttpException("Un utilisateur existe déjà dans la base de données",HttpStatus.BAD_REQUEST);
      }
      console.log(error);
      throw new HttpException("Une erreur est survenue", HttpStatus.INTERNAL_SERVER_ERROR);

      
    }
  }

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
