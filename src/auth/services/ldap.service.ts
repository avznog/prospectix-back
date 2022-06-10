import { Injectable } from '@nestjs/common';
import { Cdp } from 'src/cdp/entities/cdp.entity';
import { CdpRepository } from 'src/cdp/repositories/cdp.repository';
import { Repository } from 'typeorm';
import { LoginCdpDto } from '../dto/login-cdp.dto';
const { authenticate } = require('ldap-authentication');

@Injectable()
export class LdapService {
  constructor(private readonly cdpRepository: CdpRepository){}

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
        console.log(this.cdpRepository.count())
      
      return false;
    } catch (error) {
      console.log(error);
      return false
    }
  }
}
