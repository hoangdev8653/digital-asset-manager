import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { Asset } from '../assets/asset.entity'; // Giả sử có entity Asset

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  age?: number;

  // Ví dụ relationship: User có nhiều Assets
  // @OneToMany(() => Asset, asset => asset.user)
  // assets: Asset[];
}
