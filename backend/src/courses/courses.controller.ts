import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Roles } from '../common/decorators';

@Controller('courses')
export class CoursesController {
  constructor(private service: CoursesService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() body: any) { return this.service.create(body); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() body: any) { return this.service.update(+id, body); }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}