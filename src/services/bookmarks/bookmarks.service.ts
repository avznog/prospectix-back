import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StageType } from 'src/constants/stage.type';
import { CreateBookmarkDto } from 'src/dto/bookmarks/create-bookmark.dto';
import { ResearchParamsBookmarksDto } from 'src/dto/bookmarks/research-params-bookmarks.dto';
import { Bookmark } from 'src/entities/bookmarks/bookmark.entity';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';

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
      researchParamsBookmarksDto.zipcode = +researchParamsBookmarksDto.zipcode
      return await this.bookmarkRepository.find({
        relations: ["prospect", "pm", "prospect.secondaryActivity", "prospect.city", "prospect.country", "prospect.events", "prospect.meetings", "prospect.phone", "prospect.reminders", "prospect.website", "prospect.email"],
        where: [
          researchParamsBookmarksDto.keyword == "" && researchParamsBookmarksDto.zipcode != -1000 && researchParamsBookmarksDto.secondaryActivity! != "allActivities" && {
            prospect: {
              stage: StageType.BOOKMARK,
              city: {
                zipcode: researchParamsBookmarksDto.zipcode
              },
              secondaryActivity: {
                name: researchParamsBookmarksDto.secondaryActivity
              }
              
            },
            pm: {
              pseudo: user.pseudo
            }
            
          },
          researchParamsBookmarksDto.keyword == "" && researchParamsBookmarksDto.zipcode == -1000 && researchParamsBookmarksDto.secondaryActivity! != "allActivities" && {
            prospect: {
              stage: StageType.BOOKMARK,
            secondaryActivity: {
              name: researchParamsBookmarksDto.secondaryActivity
            }
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          researchParamsBookmarksDto.keyword == "" && researchParamsBookmarksDto.secondaryActivity! == "allActivities" && researchParamsBookmarksDto.zipcode == -1000 && {
            prospect: {
              stage: StageType.BOOKMARK
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          researchParamsBookmarksDto.keyword == "" && researchParamsBookmarksDto.secondaryActivity! == "allActivities" && researchParamsBookmarksDto.zipcode != -1000 && {
            prospect: {
              stage: StageType.BOOKMARK,
            city: {
              zipcode: researchParamsBookmarksDto.zipcode
            }
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          researchParamsBookmarksDto.keyword != "" && {
            prospect: {
              stage: StageType.BOOKMARK,
              companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`)
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          researchParamsBookmarksDto.keyword != "" && {
            prospect: {
              stage: StageType.BOOKMARK,
              city: {
                name: ILike(`%${researchParamsBookmarksDto.keyword}%`)
              }
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          researchParamsBookmarksDto.keyword != "" && {
            prospect: {
              stage: StageType.BOOKMARK,
              secondaryActivity: {
                name: ILike(`%${researchParamsBookmarksDto.keyword}%`)
              }
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          researchParamsBookmarksDto.keyword != "" && {
            prospect: {
              stage: StageType.BOOKMARK,
              phone: {
                number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
              }
            },
            pm: {
              pseudo: user.pseudo
            }
          }
        ]
      }
      );
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les prospects favoris", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async countBookmarks(researchParamsBookmarksDto: ResearchParamsBookmarksDto, user: ProjectManager) : Promise<number> {
    try {
      return await this.bookmarkRepository.count({
        where: [
          researchParamsBookmarksDto.keyword == "" && researchParamsBookmarksDto.zipcode != -1000 && researchParamsBookmarksDto.secondaryActivity! != "allActivities" && {
            prospect: {
              stage: StageType.BOOKMARK,
              city: {
                zipcode: researchParamsBookmarksDto.zipcode
              },
              secondaryActivity: {
                name: researchParamsBookmarksDto.secondaryActivity
              }
              
            },
            pm: {
              pseudo: user.pseudo
            }
            
          },
          researchParamsBookmarksDto.keyword == "" && researchParamsBookmarksDto.zipcode == -1000 && researchParamsBookmarksDto.secondaryActivity! != "allActivities" && {
            prospect: {
              stage: StageType.BOOKMARK,
            secondaryActivity: {
              name: researchParamsBookmarksDto.secondaryActivity
            }
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          researchParamsBookmarksDto.keyword == "" && researchParamsBookmarksDto.secondaryActivity! == "allActivities" && researchParamsBookmarksDto.zipcode == -1000 && {
            prospect: {
              stage: StageType.BOOKMARK
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          researchParamsBookmarksDto.keyword == "" && researchParamsBookmarksDto.secondaryActivity! == "allActivities" && researchParamsBookmarksDto.zipcode != -1000 && {
            prospect: {
              stage: StageType.BOOKMARK,
            city: {
              zipcode: researchParamsBookmarksDto.zipcode
            }
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          researchParamsBookmarksDto.keyword != "" && {
            prospect: {
              stage: StageType.BOOKMARK,
              companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`)
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          researchParamsBookmarksDto.keyword != "" && {
            prospect: {
              stage: StageType.BOOKMARK,
              city: {
                name: ILike(`%${researchParamsBookmarksDto.keyword}%`)
              }
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          researchParamsBookmarksDto.keyword != "" && {
            prospect: {
              stage: StageType.BOOKMARK,
              secondaryActivity: {
                name: ILike(`%${researchParamsBookmarksDto.keyword}%`)
              }
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          researchParamsBookmarksDto.keyword != "" && {
            prospect: {
              stage: StageType.BOOKMARK,
              phone: {
                number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
              }
            },
            pm: {
              pseudo: user.pseudo
            }
          }
        ]
      })
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de compter les favoris", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
