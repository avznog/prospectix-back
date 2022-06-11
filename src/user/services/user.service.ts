import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcrypt";
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}


  // async find(){
  //   console.log("hjrzejzepojezpo$kfz")
  //   const test = await this.userRepository.findOne({
  //     where: {
  //       username: "test"
  //     }
  //   });
  //   return test
  // }

  // async getByUsername(username: string): Promise<User>{
  //   const user = await this.userRepository.findOne({where: {username: username}});
  //   if(user){
  //     return user;
  //   }

  //   throw new HttpException("User with this username does not exists", HttpStatus.NOT_FOUND);
  // }

  // async getById(id: number): Promise<User>{
  //   const user = await this.userRepository.findOne({ where: {id} });
  //   if(user){
  //     return user;
  //   }
  //   throw new HttpException("User with this id does not exist", HttpStatus.NOT_FOUND);
  // }
  

  // async getUserIfRefreshTokenMatches(refreshToken: string, username: string) : Promise<User>{
  //   const user = await this.getByUsername(username);

  //   const isRefreshtokenMatching = await bcrypt.compare(
  //     refreshToken,
  //     user.currentHashedRefreshToken
  //   );

  //   if(isRefreshtokenMatching) {
  //     return user;
  //   }
  // }

  // async removeRefreshToken(username: string) : Promise<UpdateResult> {
  //   return this.userRepository.update(username, {
  //     currentHashedRefreshToken: null
  //   });
  // }

}
