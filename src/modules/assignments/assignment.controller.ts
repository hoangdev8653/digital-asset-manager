import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './assignment.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}
  @Get()
  async getAllAssignments() {
    const assignments = await this.assignmentService.getAllAssignments();
    return {
      message: 'Lấy danh sách bài tập thành công',
      data: assignments,
    };
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getAssignmentsByUser(@Request() req: { user: { id: string } }) {
    const userId = req.user.id;
    const assignments =
      await this.assignmentService.getAssignmentsByUser(userId);
    return {
      message: 'Lấy tất cả thông tin tài sản được giao',
      data: assignments,
    };
  }
  @Get(':id')
  async getAssignment(@Param('id') id: string) {
    const assignment = await this.assignmentService.getAssignment(id);
    return {
      message: 'Lấy bài tập thành công',
      data: assignment,
    };
  }
  @Post('')
  @UseGuards(JwtAuthGuard)
  async createAssignment(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @Request() req: { user: { id: string } },
  ) {
    createAssignmentDto.assigned_by = req.user.id;
    const assignment =
      await this.assignmentService.createAssignment(createAssignmentDto);
    return {
      message: 'Tạo bài tập thành công',
      data: assignment,
    };
  }
  @Put(':id')
  async updateAssignment(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    const assignment = await this.assignmentService.updateAssignment(
      id,
      updateAssignmentDto,
    );
    return {
      message: 'Cập nhật bài tập thành công',
      data: assignment,
    };
  }
  @Delete(':id')
  async deleteAssignment(@Param('id') id: string) {
    const assignment = await this.assignmentService.deleteAssignment(id);
    return {
      message: 'Xóa bài tập thành công',
      data: assignment,
    };
  }
}
