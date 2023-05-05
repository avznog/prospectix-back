import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { ProjectManagersService } from 'src/users/project-managers/project-managers.service';
import { AuthController } from './auth.controller';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './services/auth.service';
import { LdapService } from './services/ldap.service';
import { Auth } from './entities/auth.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectManager, Auth]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        signOptions: {
          expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
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
    ProjectManagersService
  ],
  controllers: [AuthController]
})
export class AuthModule {}
