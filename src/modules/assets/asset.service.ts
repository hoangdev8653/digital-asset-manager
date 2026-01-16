import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssetDto, UpdateAssetDto } from './asset.dto';
import { Asset } from './entities/asset.entities';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
  ) {}
  async getAllAssets(): Promise<Asset[]> {
    const assets = await this.assetRepository.find({
      relations: ['assetType'],
    });
    return assets;
  }
  async getAsset(id: string): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id },
      relations: ['assetType'],
    });
    return asset;
  }
  async createAsset(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = this.assetRepository.create(createAssetDto);
    return await this.assetRepository.save(asset);
  }
  async updateAsset(id: string, updateAsset: UpdateAssetDto): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id },
    });
    if (!asset) {
      throw new NotAcceptableException('Tài sản không tồn tại');
    }
    const updatedAsset = Object.assign(asset, updateAsset);
    return await this.assetRepository.save(updatedAsset);
  }
  async deleteAsset(id: string): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id },
    });
    if (!asset) {
      throw new NotAcceptableException('Tài sản không tồn tại');
    }
    return await this.assetRepository.remove(asset);
  }
}
