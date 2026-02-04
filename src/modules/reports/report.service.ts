import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateReportDto, UpdateReportDto, PaginationDto } from './report.dto';
import { Report } from './entities/report.entities';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { SystemLogService } from '../systemLog/systemLog.service';
import { calculateGrowthRate, getMonthComparisonRanges } from '../../utils/statistics.util';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    private cloudinaryService: CloudinaryService,
    private readonly systemLogService: SystemLogService,
  ) { }
  async getAllReports(paginationDto: PaginationDto) {
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 10;
    const skip = (page - 1) * limit;
    const [data, total] = await this.reportRepository.findAndCount({ where: {}, skip, take: limit });
    const { currentMonthStart, currentMonthEnd, lastMonthStart, lastMonthEnd } = getMonthComparisonRanges()
    const currentMonth = await this.reportRepository.count({ where: { created_at: Between(currentMonthStart, currentMonthEnd) } })
    const lastMonth = await this.reportRepository.count({ where: { created_at: Between(lastMonthStart, lastMonthEnd) } })
    const { formattedGrowthRate, isIncrease } = calculateGrowthRate(currentMonth, lastMonth)
    return { data, total, page, limit, totalPages: Math.ceil(total / limit), statistics: { currentMonth, lastMonth, growthRate: formattedGrowthRate, isIncrease } }
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
      details: 'Tạo mới báo cáo',
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
      details: 'Cập nhật báo cáo',
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
