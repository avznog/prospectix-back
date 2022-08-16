import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { UpdateResult } from 'typeorm';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';

@Controller('websites')
@ApiTags("websites")
@UseGuards(JwtAuthGuard, RolesGuard)
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Patch(":id")
  update(@Param("id") idWebsite: number, @Body() updateWebsiteDto: UpdateWebsiteDto) : Promise<UpdateResult> {
    return this.websitesService.update(idWebsite, updateWebsiteDto);
  }
}
