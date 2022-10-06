import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NegativeAnswersService } from './negative-answers.service';
import { CreateNegativeAnswerDto } from './dto/create-negative-answer.dto';
import { UpdateNegativeAnswerDto } from './dto/update-negative-answer.dto';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { RolesType } from 'src/auth/role.type';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

@Controller('negative-answers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NegativeAnswersController {
  constructor(private readonly negativeAnswersService: NegativeAnswersService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createNegativeAnswerDto: CreateNegativeAnswerDto) {
    return this.negativeAnswersService.create(createNegativeAnswerDto);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("create-for-me")
  createForMe(@Body() createNegativeAnswerDto: CreateNegativeAnswerDto, @CurrentUser() user: ProjectManager) {
    return this.negativeAnswersService.createForMe(createNegativeAnswerDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-for-me")
  countAllForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    return this.negativeAnswersService.countAllForMe(user);
  }
}
