import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
// import { Assignment } from '../../assignments/entities/assignment.entity';

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

  // Relationship: User có nhiều Assignments
  // @OneToMany(() => Assignment, (assignment) => assignment.user)
  // assignments: Assignment[];
}
