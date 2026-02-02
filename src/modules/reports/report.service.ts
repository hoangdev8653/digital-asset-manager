import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto, UpdateReportDto } from './report.dto';
import { Report } from './entities/report.entities';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { SystemLogService } from '../systemLog/systemLog.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    private cloudinaryService: CloudinaryService,
    private readonly systemLogService: SystemLogService,
  ) { }
  async getAllReports(): Promise<Report[]> {
    const reports = await this.reportRepository.find({});
    return reports;
  }
  async getReportsByUser(id: string): Promise<Report[]> {
    const reports = await this.reportRepository.find({
      where: { employee_id: id },
    });
    return reports;
  }
  async getReport(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id },
    });
    if (!report) {
      throw new NotAcceptableException('Báo cáo không tồn tại');
    }
    return report;
  }
  async createReport(
    createReportDto: CreateReportDto,
    file?: Express.Multer.File,
  ): Promise<Report> {
    if (file) {
      const result = await this.cloudinaryService.uploadFile(file);
      createReportDto.image_url = result.secure_url;
    }
    const report = this.reportRepository.create(createReportDto);
    const savedReport = await this.reportRepository.save(report);

    await this.systemLogService.createSystemLog({
      action: 'CREATE_REPORT',
      targetId: savedReport.id,
      targetType: 'REPORT',
      details: "Tạo mới báo cáo",
    });

    return savedReport;
  }
  async updateReport(
    id: string,
    updateReportDto: UpdateReportDto,
  ): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotAcceptableException('Báo cáo không tồn tại');
    }
    const updatedReport = Object.assign(report, updateReportDto);
    const savedReport = await this.reportRepository.save(updatedReport);

    await this.systemLogService.createSystemLog({
      action: 'UPDATE_REPORT',
      targetId: savedReport.id,
      targetType: 'REPORT',
      details: "Cập nhật báo cáo",
    });

    return savedReport;
  }
  async deleteReport(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotAcceptableException('Báo cáo không tồn tại');
    }
    return await this.reportRepository.remove(report);
  }
}
