import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StageType } from 'src/constants/stage.type';
import { CreateBookmarkDto } from 'src/dto/bookmarks/create-bookmark.dto';
import { ResearchParamsBookmarksDto } from 'src/dto/bookmarks/research-params-bookmarks.dto';
import { Bookmark } from 'src/entities/bookmarks/bookmark.entity';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { DeleteResult, ILike, Not, Repository } from 'typeorm';

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

  async findAllPaginated(researchParamsBookmarksDto: ResearchParamsBookmarksDto, user: ProjectManager): Promise<{bookmarks: Bookmark[], count: number}> {
    try {

      const whereParameters = 

        // ? ONLY KEYWORD
        researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.cityName && !researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.secondaryActivity && [
          {
            prospect: {
              companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`),
              stage: StageType.BOOKMARK,
              disabled: false,
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          {
            prospect: {
              phone: {
                number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
              },
              stage: StageType.BOOKMARK,
              disabled: false,
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          Number(researchParamsBookmarksDto.keyword) && {
            prospect: {
              stage: StageType.BOOKMARK,
              disabled: false,
              city: {
                zipcode: Number(researchParamsBookmarksDto.keyword)
              }  
            },
            pm: {
              pseudo: user.pseudo
            }
          }

        // ? ONLY cityName
        ] || 
        researchParamsBookmarksDto.cityName && !researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.primaryActivity && [
          {
            prospect: {
              city: {
                name: researchParamsBookmarksDto.cityName
              },
              stage: StageType.BOOKMARK,
              disabled: false,
            },
            pm: {
              pseudo: user.pseudo
            }
          },
        ] ||

        // ? ONLY PRIMARY ACTIVITY
        researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.cityName && [
          {
            prospect: {
              secondaryActivity: Not(null) && {
                primaryActivity: {
                  name: ILike(`%${researchParamsBookmarksDto.primaryActivity}%`)
                }
              },
              stage: StageType.BOOKMARK,
              disabled: false,
            },
            pm: {
              pseudo: user.pseudo
            }
          }
        ] ||

        // ? SECONDARY ACTIVITY
        researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.cityName && researchParamsBookmarksDto.primaryActivity &&
        {
          prospect: {
            secondaryActivity: {
              name: ILike(`%${researchParamsBookmarksDto.secondaryActivity}%`),
              primaryActivity: {
                name: ILike(`%${researchParamsBookmarksDto.primaryActivity}%`)
              }
            },
            stage: StageType.BOOKMARK,
            disabled: false,
          },
          pm: {
            pseudo: user.pseudo
          }

          // ? CITY AND PRIMARY ACTIVITY
        } || researchParamsBookmarksDto.cityName && researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.secondaryActivity && [
          {
            prospect: {
              stage: StageType.BOOKMARK,
              disabled: false,
              city: {
                name: researchParamsBookmarksDto.cityName
              },
              secondaryActivity: {
                primaryActivity: {
                  name:  ILike(`%${researchParamsBookmarksDto.primaryActivity}%`)
                }
              }
            },
            pm: {
              pseudo: user.pseudo
            }
          }
          // ? CITY AND KEYWORD
        ] || researchParamsBookmarksDto.cityName && researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.secondaryActivity && [
          {
            prospect: {
              companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`),
              stage: StageType.BOOKMARK,
              disabled: false,
              city: {
                name: researchParamsBookmarksDto.cityName
              }
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          {
            prospect: {
              phone: {
                number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
              },
              stage: StageType.BOOKMARK,
              disabled: false,
              city: {
                name: researchParamsBookmarksDto.cityName
              }
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          Number(researchParamsBookmarksDto.keyword) && {
            prospect: {
              stage: StageType.BOOKMARK,
              disabled: false,
              city: {
                zipcode: Number(researchParamsBookmarksDto.keyword),
                name: researchParamsBookmarksDto.cityName
              } 
            },
            pm: {
              pseudo: user.pseudo
            }
          }
          // ? CITY? PRIMARY ACTIVITY AND SECODNARY ACTIVITY
        ] || researchParamsBookmarksDto.cityName && researchParamsBookmarksDto.primaryActivity && researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.keyword && [
          {
            prospect: {
              stage: StageType.BOOKMARK,
              disabled: false,
              city: {
                name: researchParamsBookmarksDto.cityName
              },
              secondaryActivity: {
                name: researchParamsBookmarksDto.secondaryActivity,
                primaryActivity: {
                  name: researchParamsBookmarksDto.primaryActivity
                }
              }
            },
            pm: {
              pseudo: user.pseudo
            }
          }
          // ? CITY, KEYWORD, PRIMARY ACTIVITY & SECONDARY ACTIVITY (ALL FILTERS) 
        ] || researchParamsBookmarksDto.cityName && researchParamsBookmarksDto.keyword && researchParamsBookmarksDto.primaryActivity && researchParamsBookmarksDto.secondaryActivity && [
          {
            prospect: {
              companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`),
              stage: StageType.BOOKMARK,
              disabled: false,
              city: {
                name: researchParamsBookmarksDto.cityName
              },
              secondaryActivity: {
                name: researchParamsBookmarksDto.secondaryActivity,
                primaryActivity: {
                  name: researchParamsBookmarksDto.primaryActivity
                }
              }
            },
            pm: {
              pseudo: user.pseudo
            },
          },
          {
            prospect: {
              phone: {
                number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
              },
              stage: StageType.BOOKMARK,
              disabled: false,
              city: {
                name: researchParamsBookmarksDto.cityName
              },
              secondaryActivity: {
                name: researchParamsBookmarksDto.secondaryActivity,
                primaryActivity: {
                  name: researchParamsBookmarksDto.primaryActivity
                }
              }
            },
            pm: {
              pseudo: user.pseudo
            }
          },
          Number(researchParamsBookmarksDto.keyword) && {
            prospect: {
              stage: StageType.BOOKMARK,
              disabled: false,
              city: {
                name: researchParamsBookmarksDto.cityName,
                zipcode: Number(researchParamsBookmarksDto.keyword)
              },
              secondaryActivity: {
                name: researchParamsBookmarksDto.secondaryActivity,
                primaryActivity: {
                  name: researchParamsBookmarksDto.primaryActivity
                }
              }
            },
            pm: {
              pseudo: user.pseudo
            }
          }
          // ? THE REST (NO FILTER)
        ] || !researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.cityName && !researchParamsBookmarksDto.primaryActivity && [
          {
            prospect: {
              stage: StageType.BOOKMARK,
              disabled: false
            },
            pm: {
              pseudo: user.pseudo
            }
          }
        ];

      // ! Count max bookmarks avalaible
      const countbookmarks= await this.bookmarkRepository.countBy(whereParameters);

      // ! find bookmarks
      const bookmarks =  await this.bookmarkRepository.find({
        relations: ["prospect", "pm", "prospect.secondaryActivity", "prospect.secondaryActivity.primaryActivity", "prospect.city", "prospect.country", "prospect.events", "prospect.meetings", "prospect.phone", "prospect.reminders", "prospect.website", "prospect.email"],
        where: whereParameters,
        take: researchParamsBookmarksDto.take,
        skip: researchParamsBookmarksDto.skip,
        order: {
          prospect: {
            phone: {
              number: "desc"
            }
          }
        }
      });

      return {
        bookmarks: bookmarks,
        count: countbookmarks
      }
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les prospects", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
