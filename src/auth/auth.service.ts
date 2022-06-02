import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from "bcrypt";
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService){}

  public async register(registrationData: RegisterDto){
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
      
      throw new HttpException("Une erreur est survenue", HttpStatus.BAD_REQUEST);
    }
  }

  public async getAuthentication(identifier: string, plainTextPassword: string){
    try{
      const user = await this.userService.getByIdentifier(identifier);
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
}
