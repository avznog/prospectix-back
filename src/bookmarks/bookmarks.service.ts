import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StageType } from 'src/constants/stage.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { ResearchParamsBookmarksDto } from './dto/research-params-bookmarks.dto';
import { Bookmark } from './entities/bookmark.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>
  ) { }

  async create(createBookmarkDto: CreateBookmarkDto, user: ProjectManager) : Promise<Bookmark> {
    try{
      createBookmarkDto.pm = user;
      return await this.bookmarkRepository.save(createBookmarkDto);
    } catch(error) {
      console.log(error);
      throw new HttpException("Impossible de créer le favoris",HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(idBookmark: number) : Promise<DeleteResult> {
    try {
      return await this.bookmarkRepository.delete(idBookmark);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de supprimer le favoris",HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllPaginated(researchParamsBookmarksDto: ResearchParamsBookmarksDto, user: ProjectManager): Promise<Bookmark[]> {
    try {
      return await this.bookmarkRepository.find({
        relations: ["prospect", "pm", "prospect.activity", "prospect.city", "prospect.country", "prospect.events", "prospect.meetings", "prospect.phone", "prospect.reminders", "prospect.website", "prospect.email"],
        where: {
          prospect: {
            stage: StageType.BOOKMARK,
            disabled: false,
            city: {
              name: researchParamsBookmarksDto.city
            },
            activity: {
              name: researchParamsBookmarksDto.activity
            }
          },
          pm: {
            pseudo: user.pseudo
          },
        },
        take: researchParamsBookmarksDto.take,
        skip: researchParamsBookmarksDto.skip,
        order: {
          creationDate: "ASC"
        }
      }
      );
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les prospects favoris", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
