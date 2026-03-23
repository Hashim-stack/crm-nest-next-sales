import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum LeadStatus {
  NEW = 'NEW', CONTACTED = 'CONTACTED', DEMO = 'DEMO',
  NEGOTIATION = 'NEGOTIATION', CONVERTED = 'CONVERTED', LOST = 'LOST',
}

export enum LeadSource {
  INSTAGRAM_AD    = 'INSTAGRAM_AD',
  FACEBOOK_AD     = 'FACEBOOK_AD',
  GOOGLE_AD       = 'GOOGLE_AD',
  EMPLOYEE_REFERRAL = 'EMPLOYEE_REFERRAL',
  STUDENT_REFERRAL  = 'STUDENT_REFERRAL',
  WALK_IN         = 'WALK_IN',
  WEBSITE         = 'WEBSITE',
  YOUTUBE         = 'YOUTUBE',
  OTHER           = 'OTHER',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn() id: number;
  @Column() name: string;
  @Column() phone: string;
  @Column() email: string;
  @Column() course_interest: string;
  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NEW }) status: LeadStatus;
  @Column({ nullable: true }) notes: string;
  @Column({ nullable: true }) counselor_id: number;
  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'counselor_id' }) counselor: User;
  @Column({ nullable: true }) follow_up_date: Date;

  @Column({ type: 'enum', enum: LeadSource, nullable: true }) lead_source: LeadSource;

  @Column({ nullable: true }) source_detail: string;

  @Column({ nullable: true }) source_campaign: string;

  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}