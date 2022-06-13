import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Repository } from 'typeorm';
import { LoginPmDto } from '../dto/login-project-manager.dto';
const { authenticate } = require('ldap-authentication');

@Injectable()
export class LdapService {
  constructor(
    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>
  ){}

  async authLdap(loginPmDto: LoginPmDto): Promise<boolean> {
    const options = {
      ldapOpts: {
        url: "ldap://ipa.juniorisep.com",
      },
      userDn: `uid=${loginPmDto.username},cn=users,cn=accounts,dc=ipa,dc=juniorisep,dc=com`,
      userPassword: loginPmDto.password,
      userSearchBase: "cn=users,cn=accounts,dc=ipa,dc=juniorisep,dc=com",
      usernameAttribute: "uid",
      username: loginPmDto.username,
    };

    try{
      
      const user = await authenticate(options);
      const pm = new ProjectManager();
      pm.pseudo = loginPmDto.username;
      pm.admin = user.memberOf.includes(
        "cn=admins,cn=groups,cn=accounts,dc=ipa,dc=juniorisep,dc=com",
      );

      const oldPm = await this.pmRepository.findOne({
        where: {
          pseudo: loginPmDto.username
        }
      });
      
      if(!oldPm){
        return false;
      }
      else{
        return true;
      }
    } catch (error) {
      console.log(error);
      throw new HttpException("Impossible de se connecter au serveur LDAP : invalid credentials", HttpStatus.FORBIDDEN)
    }
  }
}
