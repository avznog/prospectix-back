import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';
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

  async create(createBookmarkDto: CreateBookmarkDto, user: ProjectManager) : Promise<Bookmark> {
    try{
      createBookmarkDto.pm = user;
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

  async findAllPaginated(take: number, skip: number, pseudo: string, activity: string, city: string, keyword: string) : Promise<Bookmark[]> {
    try {
      return await this.bookmarkRepository.find({
        relations: ["prospect", "pm","prospect.activity","prospect.city","prospect.country","prospect.events","prospect.meetings","prospect.phone","prospect.reminders","prospect.website", "prospect.email"],
        where: [
          {
            prospect: {
              disabled: false,
              city: {
                name: city
              },
              activity: {
                name: activity
              },
              phone: {
                number: ILike(`%${keyword}%`)
              }
            },
            pm: {
              pseudo: ILike(`%${pseudo}%`)
            },
          },
          {
            prospect: {
              disabled: false,
              city: {
                name: city
              },
              activity: {
                name: activity
              },
              email: {
                email: ILike(`%${keyword}%`)
              }
            },
            pm: {
              pseudo: ILike(`%${pseudo}%`)
            },
          },
          {
            prospect: {
              disabled: false,
              city: {
                name: city
              },
              activity: {
                name: activity
              },
              website: {
                website: ILike(`%${keyword}%`)
              }
            },
            pm: {
              pseudo: ILike(`%${pseudo}%`)
            },
          },
          {
            prospect: {
              disabled: false,
              city: {
                name: city
              },
              activity: {
                name: activity
              },
              companyName: ILike(`%${keyword}%`)
            },
            pm: {
              pseudo: ILike(`%${pseudo}%`)
            },
          },
          {
            prospect: {
              disabled: false,
              city: {
                name: city
              },
              activity: {
                name: activity
              },
              streetAddress: ILike(`%${keyword}%`)
            },
            pm: {
              pseudo: ILike(`%${pseudo}%`)
            },
          },
          {
            prospect: {
              disabled: false,
              city: {
                name: city
              },
              activity: {
                name: activity
              },
              country: {
                name: ILike(`%${keyword}%`)
              }
            },
            pm: {
              pseudo: ILike(`%${pseudo}%`)
            },
          }
        ],
        take: take,
        skip: skip
      //   where: {
      //       pm: {
      //         pseudo: ILike(`%${pseudo}%`)
      //       }
      //   } && [
      //     { 
      //       disabled: false,
      //       city: {
      //         name: city
      //       },
      //       activity: {
      //         name: activity
      //       },
      //       phone: {
      //         number: ILike(`%${keyword}%`)
      //       },
      //       bookmarks: {
      //         pm: {
      //           pseudo: ILike(`%${pseudo}%`)
      //         }
      //       }
      //     },
          // { 
          //   disabled: false,
          //   city: {
          //     name: city
          //   },
          //   activity: {
          //     name: activity
          //   },
          //   website: {
      //         website: ILike(`%${keyword}%`)
      //       },
      //       bookmarks: {
      //         pm: {
      //           pseudo: ILike(`%${pseudo}%`)
      //         }
      //       }
      //     },
      //     { 
      //       disabled: false,
      //       city: {
      //         name: city
      //       },
      //       activity: {
      //         name: activity
      //       },
      //       email: {
      //         email: ILike(`%${keyword}%`)
      //       },
      //       bookmarks: {
      //         pm: {
      //           pseudo: ILike(`%${pseudo}%`)
      //         }
      //       }
      //     },
      //     { 
      //       disabled: false,
      //       city: {
      //         name: city
      //       },
      //       activity: {
      //         name: activity
      //       },
      //       companyName: ILike(`%${keyword}%`),
      //       bookmarks: {
      //         pm: {
      //           pseudo: ILike(`%${pseudo}%`)
      //         }
      //       }
      //     },
      //     { 
      //       disabled: false,
      //       city: {
      //         name: city
      //       },
      //       activity: {
      //         name: activity
      //       },
      //       streetAddress: ILike(`%${keyword}%`),
      //       bookmarks: {
      //         pm: {
      //           pseudo: ILike(`%${pseudo}%`)
      //         }
      //       }
      //     },
      //     { 
      //       disabled: false,
      //       city: {
      //         name: city
      //       },
      //       activity: {
      //         name: activity
      //       },
      //       country: {
      //         name: ILike(`%${keyword}%`)
      //       },
      //       bookmarks: {
      //         pm: {
      //           pseudo: ILike(`%${pseudo}%`)
      //         }
      //       }
      //     }
      //   ],
      //   take: take,
      //   skip: skip
      }
      );
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les prospects favoris", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
 }
