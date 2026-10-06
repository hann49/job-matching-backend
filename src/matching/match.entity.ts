import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'job_id' })
  jobId: number;

  @Column({ name: 'match_score' })
  matchScore: number;

  @CreateDateColumn({ name: 'matched_at' })
  matchedAt: Date;
}
