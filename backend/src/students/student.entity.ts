import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from '../courses/course.entity';

export enum PaymentType {
  FULL        = 'FULL',
  INSTALLMENT = 'INSTALLMENT',
}

export enum PaymentStatus {
  PENDING    = 'PENDING',
  PARTIAL    = 'PARTIAL',
  COMPLETED  = 'COMPLETED',
}

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn() id: number;
  @Column() name: string;
  @Column() phone: string;
  @Column({ nullable: true }) email: string;
  @Column() course_id: number;
  @ManyToOne(() => Course, { eager: true })
  @JoinColumn({ name: 'course_id' }) course: Course;
  @Column({ type: 'date' }) join_date: string;
  @Column({ nullable: true }) notes: string;

  // Fee tracking
  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.FULL }) payment_type: PaymentType;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) total_fees: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) paid_amount: number;
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING }) payment_status: PaymentStatus;
  // JSON array of installment records: [{amount, date, note, paid}]
  @Column({ type: 'json', nullable: true }) installments: any[];

  @CreateDateColumn() created_at: Date;
}
