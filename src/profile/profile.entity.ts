import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  skill: string;

  @Column({ length: 255 })
  education: string;

  @Column('text')
  experience: string;

  @Column('text')
  bio: string;

  @Column({ length: 20 })
  phone: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
