import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student, PaymentStatus } from './student.entity';

@Injectable()
export class StudentsService {
  constructor(@InjectRepository(Student) private repo: Repository<Student>) {}

  create(data: Partial<Student>) { return this.repo.save(this.repo.create(data)); }
  findAll()  { return this.repo.find({ relations: ['course'], order: { created_at: 'DESC' } }); }
  findOne(id: number) { return this.repo.findOne({ where: { id }, relations: ['course'] }); }

  async update(id: number, data: Partial<Student>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  // Add a payment record (installment paid or full payment)
  async addPayment(id: number, payload: { amount: number; note?: string; date?: string }) {
    const student = await this.findOne(id);
    if (!student) throw new Error('Student not found');

    const installments = student.installments || [];
    installments.push({
      id:     Date.now(),
      amount: payload.amount,
      date:   payload.date || new Date().toISOString().split('T')[0],
      note:   payload.note || '',
    });

    const newPaid = Number(student.paid_amount) + Number(payload.amount);
    const status  = newPaid >= Number(student.total_fees)
      ? PaymentStatus.COMPLETED : PaymentStatus.PARTIAL;

    await this.repo.update(id, {
      installments,
      paid_amount:    newPaid,
      payment_status: status,
    });
    return this.findOne(id);
  }

  async remove(id: number) { await this.repo.delete(id); return { message: 'Student deleted' }; }
}
