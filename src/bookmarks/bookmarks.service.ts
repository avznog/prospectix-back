import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Bookmark } from './entities/bookmark.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>
  ) { }

  async delete(idBookmark: number) : Promise<DeleteResult> {
    try {
      return await this.bookmarkRepository.delete(idBookmark);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de supprimer le favoris",HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createBookmarkDto: CreateBookmarkDto) : Promise<Bookmark> {
    try{
      return await this.bookmarkRepository.save(createBookmarkDto);
    } catch(error) {
      console.log(error);
      throw new HttpException("Impossible de créer le favoris",HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteByProspect(idProspect: number) : Promise<DeleteResult> {
    try {
      return await this.bookmarkRepository.delete({
        prospect: {
          id: idProspect
        }
      });
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de supprimer le favoris",HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() : Promise<Bookmark[]> {
    try {
      return await this.bookmarkRepository.find({
        relations: ["pm","prospect"]
      });
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer tous les favoris", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
 }
