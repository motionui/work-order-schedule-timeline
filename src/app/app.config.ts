import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { LocalStorageRepository } from './core/services/local-storage-repository';
import { WorkOrdersRepository } from './core/services/work-orders-repostory';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: WorkOrdersRepository,
      // mock data from mock-data.ts
      // useClass: MockDataRepository,

      // data from localStorage
      useClass: LocalStorageRepository,
    },
  ],
};
