import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSearchParamsDto } from 'src/dto/search-params/update-search-params.dto';
import { SearchParams } from 'src/entities/search-params/search-params.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SearchParamsService {
  constructor(
    @InjectRepository(SearchParams)
    private readonly searchParamRepository: Repository<SearchParams>
  ) {}

  async findAll() {
    try {
      return await this.searchParamRepository.find();
    } catch (error) {
      console.log(error)
      throw new HttpException("Error while getting all the search params", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: number, updateSearchParamsDto: UpdateSearchParamsDto) {
    try {
      await this.searchParamRepository.update(id, updateSearchParamsDto);
      return await this.searchParamRepository.findOne({where: {id: id}});
    } catch (error) {
      console.log(error)
      throw new HttpException("Error while updating the search apram", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
