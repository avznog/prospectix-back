import { Injectable } from '@nestjs/common';
import AppDataSource from 'src/app-data-source';
import { Cdp } from 'src/cdp/entities/cdp.entity';
import { CdpRepository } from 'src/cdp/repositories/cdp.repositories';
import { DataSource, Repository } from 'typeorm';
import { LoginCdpDto } from '../dto/login-cdp.dto';
const { authenticate } = require('ldap-authentication');

@Injectable()
export class LdapService {

  async authLdap(loginCdpDto: LoginCdpDto): Promise<boolean> {
    const options = {
      ldapOpts: {
        url: "ldap://ipa.juniorisep.com",
      },
      userDn: `uid=${loginCdpDto.username},cn=users,cn=accounts,dc=ipa,dc=juniorisep,dc=com`,
      userPassword: loginCdpDto.password,
      userSearchBase: "cn=users,cn=accounts,dc=ipa,dc=juniorisep,dc=com",
      usernameAttribute: "uid",
      username: loginCdpDto.username,
    };

    try{
      
      const user = await authenticate(options);
      
      const cdp = new Cdp();
      
      cdp.pseudo = loginCdpDto.username;
      
      cdp.admin = user.memberOf.includes(
        "cn=admins,cn=groups,cn=accounts,dc=ipa,dc=juniorisep,dc=com",
      );
      
      const oldCdp = await CdpRepository.findOneBy({
        pseudo: loginCdpDto.username
      })

      if(!oldCdp){
        return false;
      }
      else{
        return true;
      }
    } catch (error) {
      console.log(error);
      return false
    }
  }
}
