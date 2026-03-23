import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { Roles, CurrentUser } from '../common/decorators';

@Controller('leads')
export class LeadsController {
  constructor(private service: LeadsService) {}

  @Post()
  create(@Body() body: any, @CurrentUser() user: any) {
    if (user.role === 'COUNSELOR') body.counselor_id = user.id;
    return this.service.create(body);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    if (user.role === 'COUNSELOR') return this.service.findByCounselor(user.id);
    return this.service.findAll();
  }

  @Get('stats')
  @Roles('ADMIN')
  stats() {
    return this.service.stats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.service.update(+id, body, user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}