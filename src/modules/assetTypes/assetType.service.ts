import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssetTypeDto, UpdateAssetTypeDto } from './assetType.dto';
import { AssetType } from './entities/assetType.entities';
import { SystemLogService } from '../systemLog/systemLog.service';

@Injectable()
export class AssetTypeService {
  constructor(
    @InjectRepository(AssetType)
    private assetTypeRepository: Repository<AssetType>,
    private readonly systemLogService: SystemLogService,
  ) { }

  async getAllAssetTypes(): Promise<AssetType[]> {
    const assetTypes = await this.assetTypeRepository.find();
    return assetTypes;
  }

  async getAssetType(id: string): Promise<AssetType> {
    const assetType = await this.assetTypeRepository.findOne({
      where: { id },
    });
    if (!assetType) {
      throw new NotFoundException('Loại tài sản không tồn tại');
    }
    return assetType;
  }

  async createAssetType(
    createAssetTypeDto: CreateAssetTypeDto,
  ): Promise<AssetType> {
    const assetType = this.assetTypeRepository.create(createAssetTypeDto);
    const savedAssetType = await this.assetTypeRepository.save(assetType);

    await this.systemLogService.createSystemLog({
      action: 'CREATE_ASSET_TYPE',
      targetId: savedAssetType.id,
      targetType: 'ASSET_TYPE',
      details: { description: `Tạo mới loại tài sản: ${savedAssetType.name}` },
    });

    return savedAssetType;
  }
  async updateAssetType(
    id: string,
    updateAssetTypeDto: UpdateAssetTypeDto,
  ): Promise<AssetType> {
    const assetType = await this.assetTypeRepository.findOne({
      where: { id },
    });
    if (!assetType) {
      throw new NotFoundException('Loại tài sản không tồn tại');
    }
    const updatedAssetType = Object.assign(assetType, updateAssetTypeDto);
    const savedAssetType = await this.assetTypeRepository.save(updatedAssetType);

    await this.systemLogService.createSystemLog({
      action: 'UPDATE_ASSET_TYPE',
      targetId: savedAssetType.id,
      targetType: 'ASSET_TYPE',
      details: { description: `Cập nhật loại tài sản: ${savedAssetType.name}`, changes: updateAssetTypeDto },
    });

    return savedAssetType;
  }
  async deleteAssetType(id: string): Promise<AssetType> {
    const assetType = await this.assetTypeRepository.findOne({
      where: { id },
    });
    if (!assetType) {
      throw new NotFoundException('Loại tài sản không tồn tại');
    }
    const deletedAssetType = await this.assetTypeRepository.remove(assetType);

    await this.systemLogService.createSystemLog({
      action: 'DELETE_ASSET_TYPE',
      targetId: id,
      targetType: 'ASSET_TYPE',
      details: { description: `Xóa loại tài sản: ${assetType.name}` },
    });

    return deletedAssetType;
  }
}
