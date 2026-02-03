import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('system_logs')
export class SystemLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  targetId: string;

  @Column()
  targetType: string;

  @Column({ type: 'jsonb' })
  details: any;

  @CreateDateColumn()
  createdAt: Date;
}
