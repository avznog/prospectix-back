import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>
  ) {}

  async findAll() : Promise<Country[]> {
    try {
      return await this.countryRepository.find();
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer tous les pays",HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
