import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AppDataSource from 'src/app-data-source';
import { Cdp } from 'src/cdp/entities/cdp.entity';
import { Repository } from 'typeorm';
import { LoginCdpDto } from '../dto/login-cdp.dto';
const { authenticate } = require('ldap-authentication');

@Injectable()
export class LdapService {
  constructor(
    @InjectRepository(Cdp)
    private readonly cdpRepository: Repository<Cdp>
  ){

  }

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
      console.log("where")  
      const cdp = new Cdp();
      cdp.pseudo = loginCdpDto.username;
      cdp.admin = user.memberOf.includes(
        "cn=admins,cn=groups,cn=accounts,dc=ipa,dc=juniorisep,dc=com",
      );
      // const oldCdp = await CdpRepository.manager.findOneBy(Cdp, {pseudo: loginCdpDto.username})
      // const oldCdp = await CdpRepository.manager.findOneBy
      console.log(user)
      console.log(cdp)
      console.log(cdp.pseudo)
      

      const oldCdp = await this.cdpRepository.findOne({
        where: {
          pseudo: loginCdpDto.username
        }
      })
      console.log(oldCdp)
      if(!oldCdp){
        return false;
      }
      else{
        console.log("found ?")
        return true;
      }
    } catch (error) {
      
      console.log(error);
      return false
    }
  }
}
