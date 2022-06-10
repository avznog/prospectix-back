import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { LdapService } from './services/ldap.service';
import { AuthService } from './services/auth.service';
import { CdpModule } from 'src/cdp/cdp.module';
import { CdpService } from 'src/cdp/cdp.service';
import { Cdp } from 'src/cdp/entities/cdp.entity';


@Module({
  imports: [
    CdpModule,
    UserModule,
    PassportModule,
    ConfigModule,
    TypeOrmModule.forFeature([Cdp]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_ACCESS_TOKEN_SECRET"),
        signOptions: {
          expiresIn: `${configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")}s`,
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    LdapService,
    CdpService
  ],
  controllers: [AuthController]
})
export class AuthModule {}
