import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogService } from './systemLog.service';
import { SystemLogController } from './systemLog.controller';
import { SystemLog } from './entites/systemLog.entities';

@Module({
    imports: [TypeOrmModule.forFeature([SystemLog])],
    controllers: [SystemLogController],
    providers: [SystemLogService],
    exports: [SystemLogService],
})
export class SystemLogModule { }
