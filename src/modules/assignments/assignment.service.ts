import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignments } from './entities/assignment.entities';
import { CreateAssignmentDto, UpdateAssignmentDto } from './assignment.dto';
import { Asset } from '../assets/entities/asset.entities';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignments)
    private assignmentsRepository: Repository<Assignments>,
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
  ) {}
  async getAllAssignments(): Promise<Assignments[]> {
    const assignments = await this.assignmentsRepository.find({
      relations: ['asset', 'employee'],
      select: {
        id: true,
        status: true,
        expired_at: true,
        assigned_at: true,
        assigned_by: true,
        note: true,
        asset: {
          id: true,
          title: true,
          metadata: true,
          status: true,
        },
        employee: {
          id: true,
          name: true,
          role: true,
        },
      },
    });
    return assignments;
  }
  async getAssignment(id: string): Promise<Assignments> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: ['asset', 'employee'],
      select: {
        id: true,
        status: true,
        expired_at: true,
        assigned_at: true,
        assigned_by: true,
        note: true,
        asset: {
          id: true,
          title: true,
          metadata: true,
          status: true,
        },
        employee: {
          id: true,
          name: true,
          role: true,
        },
      },
    });
    if (!assignment) {
      throw new NotAcceptableException('Assignment not found');
    }
    return assignment;
  }
  async getAssignmentsByUser(id: string): Promise<Assignments[]> {
    const assignments = await this.assignmentsRepository.find({
      where: { employee: { id } },
      relations: ['asset', 'employee'],
      select: {
        id: true,
        status: true,
        expired_at: true,
        assigned_at: true,
        assigned_by: true,
        note: true,
        asset: {
          id: true,
          title: true,
          metadata: true,
          status: true,
        },
        employee: {
          id: true,
          name: true,
          role: true,
        },
      },
    });
    return assignments;
  }
  async createAssignment(
    createAssignmentDto: CreateAssignmentDto,
  ): Promise<Assignments> {
    const { asset_id } = createAssignmentDto;
    const asset = await this.assetRepository.findOne({
      where: { id: asset_id },
    });
    if (!asset) {
      throw new NotAcceptableException('Tài sản không tồn tại');
    }
    if (asset.status !== 'available') {
      throw new NotAcceptableException(
        'Tài sản này không khả dụng (đã được giao hoặc hỏng)',
      );
    }

    const assignment = this.assignmentsRepository.create(createAssignmentDto);
    const savedAssignment = await this.assignmentsRepository.save(assignment);
    await this.updateAssetStatus(asset_id, 'assigned');
    return savedAssignment;
  }
  async updateAssignment(
    id: string,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<Assignments> {
    const assignment = await this.assignmentsRepository.findOneBy({ id });
    if (!assignment) {
      throw new NotAcceptableException('Assignment not found');
    }
    await this.assignmentsRepository.update(id, updateAssignmentDto);
    return await this.getAssignment(id);
  }
  async deleteAssignment(id: string): Promise<Assignments> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
    });
    if (!assignment) {
      throw new NotAcceptableException('Assignment not found');
    }
    return await this.assignmentsRepository.remove(assignment);
  }

  private async updateAssetStatus(
    assetId: string,
    status: string,
  ): Promise<void> {
    await this.assetRepository.update(assetId, { status });
  }
}
