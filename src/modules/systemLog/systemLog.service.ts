import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLog } from './entites/systemLog.entities';
import { CreateSystemLogDto, UpdateSystemLogDto, PaginationDto } from './sytstemLog.dto';

@Injectable()
export class SystemLogService {
    constructor(
        @InjectRepository(SystemLog)
        private readonly systemLogRepository: Repository<SystemLog>,
    ) { }

    async getAllSystemLogs(paginationDto: PaginationDto) {
        const page = Number(paginationDto.page) || 1;
        const limit = Number(paginationDto.limit) || 10;
        const skip = (page - 1) * limit;
        const [data, total] = await this.systemLogRepository.findAndCount({
            order: { createdAt: 'DESC' },
            skip: skip,
            take: limit,
        });
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getSystemLog(id: string): Promise<SystemLog> {
        const log = await this.systemLogRepository.findOne({ where: { id } });
        if (!log) {
            throw new NotFoundException(`SystemLog with ID ${id} not found`);
        }
        return log;
    }

    async createSystemLog(createSystemLogDto: CreateSystemLogDto): Promise<SystemLog> {
        const newLog = this.systemLogRepository.create(createSystemLogDto);
        return await this.systemLogRepository.save(newLog);
    }

    async updateSystemLog(id: string, updateSystemLogDto: UpdateSystemLogDto): Promise<SystemLog> {
        const log = await this.getSystemLog(id);
        Object.assign(log, updateSystemLogDto);
        return await this.systemLogRepository.save(log);
    }

    async deleteSystemLog(id: string): Promise<void> {
        const log = await this.getSystemLog(id);
        await this.systemLogRepository.remove(log);
    }
}
