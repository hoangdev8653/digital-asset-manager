import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Assignments } from '../../assignments/entities/assignment.entities';
import { Notification } from '../../notifications/entities/notification.entities';
import { UserStatus } from '../../../common/enums/status.enum';

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
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @OneToMany(() => Assignments, (assignment) => assignment.employee)
  assignments: Assignments[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
