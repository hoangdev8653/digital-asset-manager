import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { AssetType } from '../../assetTypes/entities/assetType.entities';
import { Assignments } from '../../assignments/entities/assignment.entities';
import { AssetStatus } from '../../../common/enums/status.enum';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({
    type: 'enum',
    enum: AssetStatus,
    default: AssetStatus.AVAILABLE,
  })
  status: AssetStatus;

  @Column({ nullable: true })
  expired_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  asset_type_id: string;

  @ManyToOne(() => AssetType, (assetType) => assetType.assets)
  @JoinColumn({ name: 'asset_type_id' })
  assetType: AssetType;

  @OneToMany(() => Assignments, (assignment) => assignment.asset)
  assignments: Assignments[];
}
