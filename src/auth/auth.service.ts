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
      // throw new HttpException("Une erreur est test", HttpStatus.BAD_REQUEST);

      
    }
  }

  public async getAuthentication(username: string, plainTextPassword: string): Promise<User>{
    try{
      const user = await this.userService.getByUsername(username);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    }catch{
      throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST);
    }
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string){
    const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
    if(!isPasswordMatching){
      throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST);
    }
  }

  public getCookieWithJwtToken(userId: number): string{
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get("JWT_EXPIRATION_TIME")}`;
  }

  public getCookieForLogOut(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
