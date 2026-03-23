import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './lead.entity';

@Injectable()
export class LeadsService {
  constructor(@InjectRepository(Lead) private repo: Repository<Lead>) {}

  create(data: Partial<Lead>) {
    return this.repo.save(this.repo.create(data));
  }

  findAll() {
    return this.repo.find({ relations: ['counselor'], order: { created_at: 'DESC' } });
  }

  findByCounselor(counselorId: number) {
    return this.repo.find({
      where: { counselor_id: counselorId },
      relations: ['counselor'],
      order: { created_at: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['counselor'] });
  }

  async update(id: number, data: Partial<Lead>, user: any) {
    const lead = await this.repo.findOne({ where: { id } });
    if (!lead) throw new ForbiddenException('Lead not found');
    if (user.role === 'COUNSELOR' && lead.counselor_id !== user.id)
      throw new ForbiddenException('Not your lead');
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'Lead deleted' };
  }

  async stats() {
    const total = await this.repo.count();
    const byStatus = await this.repo
      .createQueryBuilder('lead')
      .select('lead.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('lead.status')
      .getRawMany();
    const byCounselor = await this.repo
      .createQueryBuilder('lead')
      .leftJoin('lead.counselor', 'c')
      .select('c.name', 'counselor')
      .addSelect('COUNT(*)', 'count')
      .groupBy('c.name')
      .getRawMany();
    return { total, byStatus, byCounselor };
  }
}
