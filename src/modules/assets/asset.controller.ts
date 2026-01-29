import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { CreateAssetDto, UpdateAssetDto, PaginationDto } from './asset.dto';
import { AssetService } from './asset.service';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) { }
  @Get()
  async getAllAssets(@Query() query: PaginationDto) {
    const result = await this.assetService.getAllAssets(query);
    return {
      message: 'Lấy danh sách tài sản thành công',
      ...result,
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
    @Body() updateAssetDto: UpdateAssetDto,
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
