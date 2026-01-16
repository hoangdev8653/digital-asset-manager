import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';

@Entity('notification_logs')
export class NotificationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: ['NEW_ASSIGN', 'RENEWAL', 'EXPIRATION_WARNING'],
  })
  type: 'NEW_ASSIGN' | 'RENEWAL' | 'EXPIRATION_WARNING';

  @Column('text')
  content: string;

  @Column({ type: 'timestamp' })
  sent_at: Date;
}
