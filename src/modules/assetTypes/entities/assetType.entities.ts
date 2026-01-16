import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Asset } from '../../assets/entities/asset.entities';

@Entity('asset_types')
export class AssetType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Asset, (asset) => asset.assetType)
  assets: Asset[];
}
