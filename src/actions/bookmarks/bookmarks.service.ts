import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment-timezone';
import { CreateBookmarkDto } from 'src/actions/bookmarks/dto/create-bookmark.dto';
import { Bookmark } from 'src/actions/bookmarks/entities/bookmark.entity';
import { StageType } from 'src/constants/stage.type';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { DeleteResult, ILike, Not, Repository } from 'typeorm';
import { ResearchParamsBookmarksDto } from './dto/research-params-bookmarks.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>
  ) { }

  async create(createBookmarkDto: CreateBookmarkDto, user: ProjectManager): Promise<Bookmark> {
    try {
      createBookmarkDto.creationDate = moment(createBookmarkDto.creationDate).tz('Europe/Paris').toDate();
      createBookmarkDto.pm = user;
      return await this.bookmarkRepository.save(createBookmarkDto);
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de créer le favoris", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(idBookmark: number): Promise<DeleteResult> {
    try {
      return await this.bookmarkRepository.delete(idBookmark);
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de supprimer le favoris", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllPaginated(researchParamsBookmarksDto: ResearchParamsBookmarksDto, user: ProjectManager): Promise<{ bookmarks: Bookmark[], count: number }> {
    try {
      // ! Count max bookmarks avalaible
      // ! find bookmarks
      const bookmarks = await this.bookmarkRepository.findAndCount({
        relations: ["prospect", "pm", "prospect.secondaryActivity", "prospect.secondaryActivity.primaryActivity", "prospect.city", "prospect.country", "prospect.events", "prospect.meetings", "prospect.phone", "prospect.reminders", "prospect.website", "prospect.email"],
        where: // ? this is the entire seach parameters. Depending on which researchParamsBookmarksDto parameters are NOT NULL, we ask a different request to the database
          // ? It is very important to define WHICH PARAMETERS ARE NOT NULL because if not, it will take the wrong request
          // ? good luck (benjamin gonzva)

          // ? ONLY KEYWORD
          researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.city && !researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.zipcode && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`),
                stage: StageType.BOOKMARK,
                disabled: false,
              }
            },
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                phone: {
                  number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
                },
                stage: StageType.BOOKMARK,
                disabled: false,
              }
            }

            // ? ONLY city
          ] ||
          researchParamsBookmarksDto.city && !researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.zipcode && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                city: {
                  name: researchParamsBookmarksDto.city,

                },
                stage: StageType.BOOKMARK,
                disabled: false,
              }
            },
          ] ||
          // ? CITY AND ZIPCODE
          researchParamsBookmarksDto.city && researchParamsBookmarksDto.zipcode && !researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.primaryActivity && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city,
                  zipcode: researchParamsBookmarksDto.zipcode
                },
              }
            }
          ]
          ||
          // ? ONLY PRIMARY ACTIVITY
          researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.city && !researchParamsBookmarksDto.zipcode && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                secondaryActivity: Not(null) && {
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity,
                  }
                },
                stage: StageType.BOOKMARK,
                disabled: false,
              }
            }
          ] ||
          // ? KEYWORD && PRIMARY
          researchParamsBookmarksDto.keyword && researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.city && !researchParamsBookmarksDto.zipcode && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`),
                stage: StageType.BOOKMARK,
                disabled: false,
                secondaryActivity: {
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity
                  }
                }
              }
            },
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                phone: {
                  number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
                },
                stage: StageType.BOOKMARK,
                disabled: false,
                secondaryActivity: {
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity
                  }
                }
              }
            }

          ] ||
          // ? ZIPCODE && PRIMARY ACTIVITY
          researchParamsBookmarksDto.city && researchParamsBookmarksDto.zipcode && researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.keyword && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                secondaryActivity: Not(null) && {
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity,
                  }
                },
                city: {
                  zipcode: researchParamsBookmarksDto.zipcode
                },
                stage: StageType.BOOKMARK,
                disabled: false,
              }
            }

          ] ||
          // ? ZIPCODE & KEYWORD
          researchParamsBookmarksDto.keyword && researchParamsBookmarksDto.city && researchParamsBookmarksDto.zipcode && !researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.secondaryActivity && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`),
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city,
                  zipcode: researchParamsBookmarksDto.zipcode
                },
              }
            },
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                phone: {
                  number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
                },
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city,
                  zipcode: researchParamsBookmarksDto.zipcode
                },
              }
            }
          ] ||
          // ? KEYWORD & SECONDARY
          researchParamsBookmarksDto.keyword && researchParamsBookmarksDto.primaryActivity && researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.city && !researchParamsBookmarksDto.zipcode && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`),
                stage: StageType.BOOKMARK,
                disabled: false,
                secondaryActivity: {
                  id: researchParamsBookmarksDto.secondaryActivity,
                  primaryActivity: {

                  }
                }
              }
            },
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                phone: {
                  number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
                },
                stage: StageType.BOOKMARK,
                disabled: false,
                secondaryActivity: {
                  id: researchParamsBookmarksDto.secondaryActivity,
                  primaryActivity: {

                  }
                }
              }
            }
          ] ||

          // ? SECONDARY ACTIVITY
          researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.city && researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.zipcode &&
          {
            pm: {
              pseudo: user.pseudo
            },
            prospect: {
              secondaryActivity: {
                id: researchParamsBookmarksDto.secondaryActivity,
                primaryActivity: {
                  id: researchParamsBookmarksDto.primaryActivity,
                }
              },
              stage: StageType.BOOKMARK,
              disabled: false
            }

          } ||
          // ? SECONDARY ACTIVITY && ZIPCODE 
          researchParamsBookmarksDto.primaryActivity && researchParamsBookmarksDto.secondaryActivity && researchParamsBookmarksDto.zipcode && researchParamsBookmarksDto.city && !researchParamsBookmarksDto.keyword && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                secondaryActivity: {
                  id: researchParamsBookmarksDto.secondaryActivity,
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity,
                  }
                },
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  zipcode: researchParamsBookmarksDto.zipcode
                }
              }
            }

          ] ||
          // ? CITY & PRIMARY & KEYWORD
          researchParamsBookmarksDto.city && researchParamsBookmarksDto.keyword && researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.zipcode && [

            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`),
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city,
                },
                secondaryActivity: {
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity
                  }
                }
              }
            },
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                phone: {
                  number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
                },
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city,
                },
                secondaryActivity: {
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity
                  }
                }
              }
            }
            // ? CITY AND PRIMARY ACTIVITY
          ] || researchParamsBookmarksDto.city && researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.zipcode && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city
                },
                secondaryActivity: {
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity,
                  }
                }
              }
            }
          ] ||
          // ? KEYWORD & PRIMARY & ZIPCODE
          researchParamsBookmarksDto.city && researchParamsBookmarksDto.zipcode && researchParamsBookmarksDto.keyword && researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.secondaryActivity && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`),
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city,
                  zipcode: researchParamsBookmarksDto.zipcode
                },
                secondaryActivity: {
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity
                  }
                }
              }
            },
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                phone: {
                  number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
                },
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city,
                  zipcode: researchParamsBookmarksDto.zipcode
                },
                secondaryActivity: {
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity
                  }
                }
              }
            }
            // ? CITY AND KEYWORD
          ] || researchParamsBookmarksDto.keyword && researchParamsBookmarksDto.city && !researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.zipcode && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`),
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city
                },
              }
            },
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                phone: {
                  number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
                },
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city
                },
              }
            }

            // ? CITY AND PRIMARY ACTIVITY AND SECONDARY ACTIVITY 
          ] || researchParamsBookmarksDto.city && researchParamsBookmarksDto.primaryActivity && researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.zipcode && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city
                },
                secondaryActivity: {
                  id: researchParamsBookmarksDto.secondaryActivity,
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity,
                  }
                }
              }
            }
            // ? CITY, KEYWORD, PRIMARY ACTIVITY & SECONDARY ACTIVITY & ZIPCODE (ALL FILTERS)
          ] || researchParamsBookmarksDto.city && researchParamsBookmarksDto.keyword && researchParamsBookmarksDto.primaryActivity && researchParamsBookmarksDto.secondaryActivity && researchParamsBookmarksDto.zipcode && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`),
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city,
                  zipcode: researchParamsBookmarksDto.zipcode
                },
                secondaryActivity: {
                  id: researchParamsBookmarksDto.secondaryActivity,
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity
                  }
                }
              }
            },
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                phone: {
                  number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
                },
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city,
                  zipcode: researchParamsBookmarksDto.zipcode
                },
                secondaryActivity: {
                  id: researchParamsBookmarksDto.secondaryActivity,
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity
                  }
                }
              }
            }
            // ? CITY AND KEYWORD AND PRIMARY AND SECONDARY
          ] || researchParamsBookmarksDto.city && researchParamsBookmarksDto.keyword && researchParamsBookmarksDto.primaryActivity && researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.zipcode && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                companyName: ILike(`%${researchParamsBookmarksDto.keyword}%`),
                stage: StageType.BOOKMARK,
                disabled: false,
                city: {
                  name: researchParamsBookmarksDto.city
                },
                secondaryActivity: {
                  id: researchParamsBookmarksDto.secondaryActivity,
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity
                  }
                }
              }
            },
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                phone: {
                  number: ILike(`%${researchParamsBookmarksDto.keyword}%`)
                },
                stage: StageType.BOOKMARK,
                disabled: false,

                city: {
                  name: researchParamsBookmarksDto.city
                },
                secondaryActivity: {
                  id: researchParamsBookmarksDto.secondaryActivity,
                  primaryActivity: {
                    id: researchParamsBookmarksDto.primaryActivity
                  }
                }
              }
            }

            // ? EVERYTHING (NO FILTER) 
          ] || !researchParamsBookmarksDto.secondaryActivity && !researchParamsBookmarksDto.keyword && !researchParamsBookmarksDto.city && !researchParamsBookmarksDto.primaryActivity && !researchParamsBookmarksDto.zipcode && [
            {
              pm: {
                pseudo: user.pseudo
              },
              prospect: {
                stage: StageType.BOOKMARK,
                disabled: false,
              }
            }
          ],
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
        bookmarks: bookmarks[0],
        count: bookmarks[1]
      }
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les prospects", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
