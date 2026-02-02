import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Asset } from '../../assets/entities/asset.entities';
import { Report } from '../../reports/entities/report.entities';
import { AssignmentStatus } from '../../../common/enums/status.enum';

@Entity('assignments')
export class Assignments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  asset_id: string;

  @ManyToOne(() => Asset, (asset) => asset.assignments)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column()
  employee_id: string;

  @ManyToOne(() => User, (user) => user.assignments)
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  @CreateDateColumn()
  assigned_at: Date;

  @Column()
  assigned_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_by' })
  assigner: User;

  @Column()
  note: string;

  @Column({ nullable: true })
  expired_at: Date | null;

  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.ACTIVE,
  })
  status: AssignmentStatus;

  @OneToMany(() => Report, (report) => report.assignment)
  reports: Report[];
}
