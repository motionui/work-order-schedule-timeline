import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { MockDataRepository } from './core/services/mock-data-repository';
import { WorkOrdersRepository } from './core/services/work-orders-repostory';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: WorkOrdersRepository,
      useClass: MockDataRepository,
    },
  ],
};
