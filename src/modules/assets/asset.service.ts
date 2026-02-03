import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CreateAssetDto, UpdateAssetDto, PaginationDto } from './asset.dto';
import { Asset } from './entities/asset.entities';
import { SystemLogService } from '../systemLog/systemLog.service';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
    private readonly systemLogService: SystemLogService,
    @InjectQueue('processing') private processingQueue: Queue,
  ) { }
  async getAllAssets(paginationDto: PaginationDto) {
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.assetRepository.findAndCount({
      relations: ['assetType'],
      select: {
        id: true,
        title: true,
        status: true,
        expired_at: true,
        metadata: true,
        assetType: {
          id: true,
          name: true,
        },
      },
      skip,
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
  async getAsset(id: string): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id },
      relations: ['assetType'],
      select: {
        id: true,
        title: true,
        status: true,
        expired_at: true,
        metadata: true,
        assetType: {
          id: true,
          name: true,
        },
      },
    });
    return asset;
  }
  async createAsset(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = this.assetRepository.create(createAssetDto);
    const savedAsset = await this.assetRepository.save(asset);

    await this.systemLogService.createSystemLog({
      action: 'CREATE_ASSET',
      targetId: savedAsset.id,
      targetType: 'ASSET',
      details: { description: `Tạo mới tài sản: ${savedAsset.title}` },
    });

    return savedAsset;
  }
  async updateAsset(
    id: string,
    updateAssetDto: UpdateAssetDto,
  ): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id },
    });
    if (!asset) {
      throw new NotAcceptableException('Tài sản không tồn tại');
    }
    const updatedAsset = Object.assign(asset, updateAssetDto);
    const savedAsset = await this.assetRepository.save(updatedAsset);

    await this.systemLogService.createSystemLog({
      action: 'UPDATE_ASSET',
      targetId: savedAsset.id,
      targetType: 'ASSET',
      details: { description: `Cập nhật tài sản: ${savedAsset.title}`, changes: updateAssetDto },
    });

    return savedAsset;
  }
  async deleteAsset(id: string): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id },
    });
    if (!asset) {
      throw new NotAcceptableException('Tài sản không tồn tại');
    }
    const deletedAsset = await this.assetRepository.remove(asset);

    await this.systemLogService.createSystemLog({
      action: 'DELETE_ASSET',
      targetId: id,
      targetType: 'ASSET',
      details: { description: `Xóa tài sản: ${asset.title}` },
    });

    return deletedAsset;
  }


  async importAssets(file: any, userId: string) {
    if (!file) {
      throw new NotAcceptableException('File is required');
    }
    await this.processingQueue.add('import-assets', {
      fileBuffer: file.buffer,
      userId,
    });
    return { message: 'File uploaded and processing started.' };
  }
}
