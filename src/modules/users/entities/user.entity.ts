import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Assignments } from '../../assignments/entities/assignment.entities';
import { Notification } from '../../notifications/entities/notification.entities';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'EMPLOYEE'],
    default: 'EMPLOYEE',
  })
  role: 'ADMIN' | 'EMPLOYEE';

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
  })
  status: 'ACTIVE' | 'INACTIVE';

  @OneToMany(() => Assignments, (assignment) => assignment.employee)
  assignments: Assignments[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
