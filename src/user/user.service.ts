import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ){}

  async create(user: CreateUserDto) : Promise<User>{
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getByIdentifier(identifier: string): Promise<User>{
    const user = this.usersRepository.findOne({where: {identifier}});
    if(user){
      return user;
    }

    throw new HttpException("User with this identifier does not exists", HttpStatus.NOT_FOUND);
  }
  

}
