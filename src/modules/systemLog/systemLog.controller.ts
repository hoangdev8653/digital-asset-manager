import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SystemLogService } from './systemLog.service';
import { CreateSystemLogDto, UpdateSystemLogDto, PaginationDto } from './sytstemLog.dto';

@Controller('system-logs')
export class SystemLogController {
    constructor(private readonly systemLogService: SystemLogService) { }
    @Get()
    async getAllSystemLogs(@Query() query: PaginationDto) {
        const result = await this.systemLogService.getAllSystemLogs(query);
        return {
            message: 'Lấy danh sách log thành công',
            ...result,
        };
    }
    @Get(':id')
    async getSystemLog(@Param('id') id: string) {
        const asset = await this.systemLogService.getSystemLog(id);
        return {
            message: 'Lấy log thành công',
            data: asset,
        };
    }
    @Post("")
    async createSystemLog(@Body() createSystemLogDto: CreateSystemLogDto) {
        const asset = await this.systemLogService.createSystemLog(createSystemLogDto);
        return {
            message: 'Tạo log thành công',
            data: asset,
        };
    }
    @Patch(':id')
    async updateSystemLog(@Param('id') id: string, @Body() updateSystemLogDto: UpdateSystemLogDto) {
        const asset = await this.systemLogService.updateSystemLog(id, updateSystemLogDto);
        return {
            message: 'Cập nhật log thành công',
            data: asset,
        };
    }
    @Delete(':id')
    async deleteSystemLog(@Param('id') id: string) {
        const asset = await this.systemLogService.deleteSystemLog(id);
        return {
            message: 'Xóa log thành công',
            data: asset,
        };
    }
}
