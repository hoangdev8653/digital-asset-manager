import { BullBoardModuleOptions } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

export const bullBoardConfig: BullBoardModuleOptions = {
    route: '/queues',
    adapter: ExpressAdapter,
};
