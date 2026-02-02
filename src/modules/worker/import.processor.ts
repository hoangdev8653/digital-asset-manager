import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as xlsx from 'xlsx';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from '../assets/entities/asset.entities';
import { Repository } from 'typeorm';
import { AssetStatus } from '../../common/enums/status.enum';
import { AssetType } from '../assetTypes/entities/assetType.entities';
import { NotificationService } from '../notifications/notification.service';

@Processor('processing')
export class ImportProcessor extends WorkerHost {
    constructor(
        @InjectRepository(Asset)
        private readonly assetRepository: Repository<Asset>,
        @InjectRepository(AssetType)
        private readonly assetTypeRepository: Repository<AssetType>,
        private readonly notificationService: NotificationService,
    ) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
            case 'import-assets':
                await this.handleImportAssets(job.data);
                break;
            default:
                console.warn(`Unknown job name: ${job.name}`);
        }
    }

    private async handleImportAssets(data: { fileBuffer: any; userId: string }) {
        const buffer = Buffer.from(data.fileBuffer.data || data.fileBuffer);
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        let successCount = 0;
        let failureCount = 0;

        for (const row of jsonData as any[]) {
            try {
                // Expected columns: Title, asset_type_id, expired_at, metadata
                const title = row['title'];
                const typeId = row['asset_type_id'];
                const expired_at = row['expired_at'];
                const metadataRaw = row['metadata'];

                if (!title || !typeId || !expired_at || !metadataRaw) {
                    failureCount++;
                    continue;
                }

                // Find Asset Type
                let assetType = await this.assetTypeRepository.findOne({
                    where: { id: typeId },
                });

                // If Asset Type not found, create it (Optional, or skip)
                // For now, let's skip if not found to be safe, or default to general
                if (!assetType) {
                    failureCount++;
                    continue;
                }

                let status = AssetStatus.AVAILABLE;
                // Map status string to Enum
                const statusUpper = expired_at?.toUpperCase();
                if (Object.values(AssetStatus).includes(statusUpper as AssetStatus)) {
                    status = statusUpper as AssetStatus;
                } else if (expired_at === 'active') status = AssetStatus.AVAILABLE; // fallback mapping

                const expiredAtRaw = row['expired_at'];
                let expiredAt = null;
                if (expiredAtRaw) {
                    expiredAt = new Date(expiredAtRaw);
                }

                let metadata = {};
                if (typeof metadataRaw === 'object') {
                    metadata = metadataRaw;
                } else if (typeof metadataRaw === 'string') {
                    try {
                        metadata = JSON.parse(metadataRaw);
                    } catch (e) {
                        // keep empty or log
                    }
                }

                const newAsset = this.assetRepository.create({
                    title,
                    assetType,
                    status,
                    metadata,
                    expired_at: expiredAt,
                });

                await this.assetRepository.save(newAsset);
                successCount++;
            } catch (error) {
                console.error('Error importing row:', row, error);
                failureCount++;
            }
        }

        // Send notification to User
        await this.notificationService.createNotification({
            title: 'Import hoàn tất',
            message: `Đã nhập thành công ${successCount} tài sản. Thất bại ${failureCount} dòng.`,
            type: 'SYSTEM',
            userId: data.userId,
            isRead: false
        });

        return { successCount, failureCount };
    }
}
