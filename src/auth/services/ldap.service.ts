import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
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
        url: "ldap://192.168.0.5",
      },
      userDn: `uid=${loginPmDto.username},cn=users,cn=accounts,dc=ipa,dc=juniorisep,dc=com`,
      userPassword: loginPmDto.password,
      userSearchBase: "cn=users,cn=accounts,dc=ipa,dc=juniorisep,dc=com",
      usernameAttribute: "uid",
      username: loginPmDto.username,
    };

    try{
      
      // const user = await authenticate(options);
      // const pm = new ProjectManager();
      // pm.pseudo = loginPmDto.username;
      // pm.admin = user.memberOf.includes(
      //   "cn=admins,cn=groups,cn=accounts,dc=ipa,dc=juniorisep,dc=com",
      // );

      // const oldPm = await this.pmRepository.findOne({
      //   where: {
      //     pseudo: loginPmDto.username,
      //   }
      // });
      // console.log(oldPm, loginPmDto.username)
      
      // if(!oldPm){
      //   return false;
      // }
      // else{
      //   if(oldPm.disabled)
      //     throw 0
      //   return true;
      // }
      return true
    } catch (error) { 
      if (error == 0)
        throw new HttpException("Impossible de se connecter: votre compte a été désactivé", HttpStatus.FORBIDDEN);
      console.log(error);
      throw new HttpException("Impossible de se connecter au serveur LDAP : invalid credentials", HttpStatus.FORBIDDEN)
    } 
  }
}
