import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCityDto } from 'src/dto/cities/create-city.dto';
import { City } from 'src/entities/cities/city.entity';
import { SearchParams } from 'src/entities/search-params/search-params.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(SearchParams)
    private readonly searchParamRepository: Repository<SearchParams>
  ) {}

  async findAll(){
    try {
      const searchParams = await this.searchParamRepository.findOne({where: {id: 1}})
      return await this.cityRepository.find({
        where: {
          // ? If we want to display only the cities that have at least 500 prospects
          // ! INCRESES CONSIDERELY THE REQUEST TIME
          // prospects: MoreThan(500),
          version: searchParams.versionCity
        },
        order: {
          name: 'asc'
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Error while counting the cities", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAllByZipcode(){
    try {
      return await this.cityRepository.find({
        order: {
          name: 'asc'
        }
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Error while counting the cities", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async create(createCityDto: CreateCityDto) : Promise<City> {
    try {
      const city = await this.cityRepository.find({
        where: {
          zipcode: createCityDto.zipcode
        }
      });
      if(city.length > 0) {
        throw new HttpException("Cette ville existe déjà dans la base de données", HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        return await this.cityRepository.save(createCityDto);
      }
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible d'ajouter la ville", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
