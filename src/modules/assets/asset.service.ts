import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssetDto, UpdateAssetDto, PaginationDto } from './asset.dto';
import { Asset } from './entities/asset.entities';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
  ) {}
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
    return await this.assetRepository.save(asset);
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
