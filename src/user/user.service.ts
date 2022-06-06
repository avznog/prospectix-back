import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}

  async getByUsername(username: string): Promise<User>{
    const user = await this.userRepository.findOne({where: {username: username}});
    if(user){
      return user;
    }

    throw new HttpException("User with this username does not exists", HttpStatus.NOT_FOUND);
  }

  async getById(id: number): Promise<User>{
    const user = await this.userRepository.findOne({ where: {id} });
    if(user){
      return user;
    }
    throw new HttpException("User with this id does not exist", HttpStatus.NOT_FOUND);
  }
  
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
  const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  
  await this.userRepository.update(userId,{
       currentHashedRefreshToken,
      });
      
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) : Promise<User>{
    const user = await this.getById(userId);

    const isRefreshtokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );

    if(isRefreshtokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) : Promise<UpdateResult> {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }

}
