import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';

@Injectable()
export class CoursesService {
  constructor(@InjectRepository(Course) private repo: Repository<Course>) {}

  create(data: Partial<Course>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find({ order: { created_at: 'DESC' } }); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  async update(id: number, data: Partial<Course>) { await this.repo.update(id, data); return this.findOne(id); }
  async remove(id: number) { await this.repo.delete(id); return { message: 'Course deleted' }; }
}