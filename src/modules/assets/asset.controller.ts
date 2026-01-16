import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { CreateAssetDto } from './asset.dto';
import { AssetService } from './asset.service';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}
  @Get()
  async getAllAssets() {
    const assets = await this.assetService.getAllAssets();
    return {
      message: 'Lấy danh sách tài sản thành công',
      data: assets,
    };
  }
  @Get(':id')
  async getAsset(@Param('id') id: string) {
    const asset = await this.assetService.getAsset(id);
    return {
      message: 'Lấy tài sản thành công',
      data: asset,
    };
  }
  @Post('')
  async createAsset(@Body() createAssetDto: CreateAssetDto) {
    const asset = await this.assetService.createAsset(createAssetDto);
    return {
      message: 'Tạo tài sản thành công',
      data: asset,
    };
  }
  @Put(':id')
  async updateAsset(
    @Param('id') id: string,
    @Body() updateAssetDto: CreateAssetDto,
  ) {
    const asset = await this.assetService.updateAsset(id, updateAssetDto);
    return {
      message: 'Cập nhật tài sản thành công',
      data: asset,
    };
  }
  @Delete(':id')
  async deleteAsset(@Param('id') id: string) {
    const asset = await this.assetService.deleteAsset(id);
    return {
      message: 'Xóa tài sản thành công',
      data: asset,
    };
  }
}
