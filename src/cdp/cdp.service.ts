import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCdpDto } from './dto/create-cdp.dto';
import { UpdateCdpDto } from './dto/update-cdp.dto';
import * as bcrypt from "bcrypt";
import { CdpRepository } from './repositories/cdp.repositories';
import { Cdp } from './entities/cdp.entity';
import { Any, UpdateResult } from 'typeorm';
import { CdpDto } from './dto/cdp.dto';
import TokenPayload from 'src/auth/interfaces/tokenPayload.interface';

@Injectable()
export class CdpService {
  create(createCdpDto: CreateCdpDto) {
    return 'This action adds a new cdp';
  }

  findAll() {
    return `This action returns all cdp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cdp`;
  }

  update(id: number, updateCdpDto: UpdateCdpDto) {
    return `This action updates a #${id} cdp`;
  }

  remove(id: number) {
    return `This action removes a #${id} cdp`;
  }

  async setCurrentRefreshToken(refreshToken: string, username: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const cdpDto = new CdpDto();
    cdpDto.username = username;
    // await CdpRepository.update(username,{
    //     pseudo: currentHashedRefreshToken
    //     });   
    await CdpRepository.manager.update
    }

    
    async findByPayload(payload: TokenPayload) {
      return CdpRepository.manager.findOneBy(Cdp, {pseudo: payload.username});
      
      // return CdpRepository.manager.findOneBy
      // { pseudo: payload.username }
    }

    async getCdpIfRefreshTokenMatches(refreshToken: string, username: string) : Promise<Cdp>{
      const user = await this.getByUsername(username);
      
      const isRefreshtokenMatching = await bcrypt.compare(
        refreshToken,
        user.currentHashedRefreshToken
      );
  
      if(isRefreshtokenMatching) {
        return user;
      }
    }

    async getByUsername(username: string){
        // const user = await .findOne({where: {username: username}});
        const user = await CdpRepository.manager.findOneBy(Cdp, {pseudo: username});
        // const user = await CdpRepository.manager.findOneBy
        if(user){
          return user;
        }
    
        throw new HttpException("Cdp with this username does not exists", HttpStatus.NOT_FOUND);
      }

    async removeRefreshToken(username: string) : Promise<UpdateResult> {
      return CdpRepository.update(username, {
        pseudo: username
      })
    }
      
}
