import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { AssetType } from '../../assetTypes/entities/assetType.entities';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  status: string | null;

  @Column({ nullable: true })
  expired_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  asset_type_id: string;

  @ManyToOne(() => AssetType, (assetType) => assetType.assets)
  @JoinColumn({ name: 'asset_type_id' })
  assetType: AssetType;
}
