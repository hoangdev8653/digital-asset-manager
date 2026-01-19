import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Request,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportService } from './report.service';
import { CreateReportDto, UpdateReportDto } from './report.dto';
import type { Express } from 'express';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  @Get()
  async getAllReports() {
    const reports = await this.reportService.getAllReports();
    return {
      message: 'Lấy danh sách báo cáo',
      data: reports,
    };
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getReportsByUser(@Request() req: { user: { id: string } }) {
    const userId = req.user.id;
    const reports = await this.reportService.getReportsByUser(userId);
    return { message: 'Lấy danh sách báo cáo', data: reports };
  }
  @Get(':id')
  async getReport(id: string) {
    const report = await this.reportService.getReport(id);
    return {
      message: 'Lấy báo cáo',
      data: report,
    };
  }
  @Post('')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image_url'))
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @Request() req: { user: { id: string } },

    @UploadedFile() file: Express.Multer.File,
  ) {
    createReportDto.employee_id = req.user.id;
    const report = await this.reportService.createReport(createReportDto, file);
    return {
      message: 'Tạo báo cáo',
      data: report,
    };
  }
  @Put(':id')
  async updateReport(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    const report = await this.reportService.updateReport(id, updateReportDto);
    return {
      message: 'Cập nhật báo cáo',
      data: report,
    };
  }
  @Delete(':id')
  async deleteReport(@Param('id') id: string) {
    const report = await this.reportService.deleteReport(id);
    return {
      message: 'Xóa báo cáo',
      data: report,
    };
  }
}
