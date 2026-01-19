import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignments } from './entities/assignment.entities';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { AuthModule } from '../auth/auth.module';
import { Asset } from '../assets/entities/asset.entities';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignments, Asset, User]), AuthModule],
  controllers: [AssignmentController],
  providers: [AssignmentService],
  exports: [AssignmentService],
})
export class AssignmentModule {}
