import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Job } from '../jobs/job.entity';
import { User } from '../users/user.entity';

@Entity('application')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'applicant_id' })
  applicant: User;

  @ManyToOne(() => Job, { nullable: false })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column({ length: 20 })
  status: string;

  @CreateDateColumn({ name: 'applied_at' })
  appliedAt: Date;
}
