import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ){}

  async create(user: CreateUserDto) : Promise<User>{
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getByUsername(username: string): Promise<User>{
    const user = this.userRepository.findOne({where: {username: username}});
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
  

}
