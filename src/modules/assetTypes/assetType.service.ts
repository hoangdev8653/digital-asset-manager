import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssetTypeDto, UpdateAssetTypeDto } from './assetType.dto';
import { AssetType } from './entities/assetType.entities';

@Injectable()
export class AssetTypeService {
  constructor(
    @InjectRepository(AssetType)
    private assetTypeRepository: Repository<AssetType>,
  ) {}

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
    return await this.assetTypeRepository.save(assetType);
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
    return await this.assetTypeRepository.save(updatedAssetType);
  }
  async deleteAssetType(id: string): Promise<AssetType> {
    const assetType = await this.assetTypeRepository.findOne({
      where: { id },
    });
    if (!assetType) {
      throw new NotFoundException('Loại tài sản không tồn tại');
    }
    return await this.assetTypeRepository.remove(assetType);
  }
}
