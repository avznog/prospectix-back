import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>
  ) {}

  async findAll() : Promise<City[]> {
    try {
      return await this.cityRepository.find();
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récuprérer les villes", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
