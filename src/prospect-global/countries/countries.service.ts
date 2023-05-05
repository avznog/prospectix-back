import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCountryDto } from 'src/prospect-global/countries/dto/create-country.dto';
import { Country } from 'src/prospect-global/countries/entities/country.entity';
import { Repository } from 'typeorm';

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

  async create(createCountryDto: CreateCountryDto) : Promise<Country> {
    try {
      return await this.countryRepository.save(createCountryDto);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de créer le pays", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
