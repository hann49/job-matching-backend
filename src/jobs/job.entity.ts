import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('job')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  posted_by: number;

  @Column({ length: 150 })
  title: string;

  @Column('text')
  description: string;

  @Column({ name: 'required_skill', type: 'text' })
  requiredskill: string;

  @Column({ type: 'date' })
  deadline: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}