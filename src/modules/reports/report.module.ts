import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entities';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { User } from '../users/entities/user.entity';
import { Assignments } from '../assignments/entities/assignment.entities';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { SystemLogModule } from '../systemLog/systemLog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, Assignments, User]),
    AuthModule,
    CloudinaryModule,
    SystemLogModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule { }
