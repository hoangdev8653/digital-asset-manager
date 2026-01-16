import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { CreateAssetTypeDto, UpdateAssetTypeDto } from './assetType.dto';
import { AssetTypeService } from './assetType.service';

@Controller('asset-types')
export class AssetTypeController {
  constructor(private readonly assetTypeService: AssetTypeService) {}
  @Get()
  async getAllAssetTypes() {
    const assetTypes = await this.assetTypeService.getAllAssetTypes();

    return {
      message: 'Lấy danh sách loại tài sản thành công',
      data: assetTypes,
    };
  }
  @Get(':id')
  async getAssetType(@Param('id') id: string) {
    const assetType = await this.assetTypeService.getAssetType(id);
    return {
      message: 'Lấy loại tài sản thành công',
      data: assetType,
    };
  }
  @Post()
  async createAssetType(@Body() createAssetTypeDto: CreateAssetTypeDto) {
    const assetType =
      await this.assetTypeService.createAssetType(createAssetTypeDto);
    return {
      message: 'Tạo loại tài sản thành công',
      data: assetType,
    };
  }

  @Put(':id')
  async updateAssetType(
    @Param('id') id: string,
    @Body() updateAssetTypeDto: UpdateAssetTypeDto,
  ) {
    const assetType = await this.assetTypeService.updateAssetType(
      id,
      updateAssetTypeDto,
    );
    return {
      message: 'Cập nhật loại tài sản thành công',
      data: assetType,
    };
  }
  @Delete(':id')
  async deleteAssetType(@Param('id') id: string) {
    const assetType = await this.assetTypeService.deleteAssetType(id);
    return {
      message: 'Xóa loại tài sản thành công',
      data: assetType,
    };
  }
}
