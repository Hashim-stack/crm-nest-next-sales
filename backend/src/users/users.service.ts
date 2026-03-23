import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(data: Partial<User>) {
    return this.repo.save(this.repo.create(data));
  }

  findAll() {
    return this.repo.find({ select: ['id', 'name', 'email', 'role', 'phone', 'created_at'] });
  }

  findCounselors() {
    return this.repo.find({
      where: { role: UserRole.COUNSELOR },
      select: ['id', 'name', 'email', 'phone'],
    });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id }, select: ['id', 'name', 'email', 'role', 'phone', 'created_at'] });
  }

  async update(id: number, data: Partial<User>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }


  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'User deleted' };
  }
}
