import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Profile } from '../profile/profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  password: string | null;

  @Column({
    name: 'google_id',
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  googleId: string | null;

  @Column({ length: 50 })
  role: string;

  @Column({ default: false, name: 'is_email_verified' })
  isEmailVerified: boolean;

  @Column({ default: false, name: 'is_blocked' })
  isBlocked: boolean;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
