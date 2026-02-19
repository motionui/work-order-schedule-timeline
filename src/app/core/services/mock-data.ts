/**
 * Mock data for work centers and work orders, used to populate the store with sample data for testing and development purposes
 */

import { WorkCenterDocument } from '../models/work-center.model';
import { WorkOrderDocument } from '../models/work-order.model';

export const SAMPLE_WORK_CENTERS: WorkCenterDocument[] = [
  {
    docId: 'f7ef9888-a8a0-45d9-a3d0-5e08d724cd47',
    docType: 'workCenter',
    data: {
      name: 'Extrusion Line A',
    },
  },
  {
    docId: 'c6a0c010-4732-4f60-b449-56b9c66af5ff',
    docType: 'workCenter',
    data: {
      name: 'CNC Machine 1',
    },
  },
  {
    docId: 'aa2dec9b-bf84-4cd1-a7b5-fe0fdfd43913',
    docType: 'workCenter',
    data: {
      name: 'Assembly Station',
    },
  },
  {
    docId: '1aa06bb8-c697-49c8-a1d6-e578c570ee27',
    docType: 'workCenter',
    data: {
      name: 'Quality Control',
    },
  },
  {
    docId: '9cd1855b-017d-4dbc-abf0-2adab414efa1',
    docType: 'workCenter',
    data: {
      name: 'Packaging Line',
    },
  },
  {
    docId: 'e1894d1f-65c5-465a-bf00-2d865d22bb33',
    docType: 'workCenter',
    data: {
      name: 'Shipping Line',
    },
  },
  {
    docId: '3fc1af3b-c159-434b-bdb8-5e03ac92e5a8',
    docType: 'workCenter',
    data: {
      name: 'Return Line',
    },
  },
];

export const SAMPLE_WORK_ORDERS: WorkOrderDocument[] = [
  {
    docId: '00816e18-c36d-4120-a0c6-c81dec9dafc0',
    docType: 'workOrder',
    data: {
      name: 'Extrusion Batch Alpha',
      workCenterId: 'f7ef9888-a8a0-45d9-a3d0-5e08d724cd47',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-04',
    },
  },
  {
    docId: 'b716a175-9632-4f6d-98f4-42fa65b0abb8',
    docType: 'workOrder',
    data: {
      name: 'Extrusion Batch Beta',
      workCenterId: 'f7ef9888-a8a0-45d9-a3d0-5e08d724cd47',
      status: 'in-progress',
      startDate: '2026-02-05',
      endDate: '2026-02-06',
    },
  },
  {
    docId: 'e7ea2d8e-dd9a-4642-854c-1824c25c9283',
    docType: 'workOrder',
    data: {
      name: 'Extrusion Batch Gamma',
      workCenterId: 'f7ef9888-a8a0-45d9-a3d0-5e08d724cd47',
      status: 'complete',
      startDate: '2026-02-07',
      endDate: '2026-02-08',
    },
  },
  {
    docId: '28075d3e-2af6-468c-92e2-995cb4e5e49c',
    docType: 'workOrder',
    data: {
      name: 'Extrusion Batch Delta',
      workCenterId: 'f7ef9888-a8a0-45d9-a3d0-5e08d724cd47',
      status: 'blocked',
      startDate: '2026-02-09',
      endDate: '2026-02-10',
    },
  },
  {
    docId: '114d47fb-67b3-44af-9a1d-bfe7a7226e83',
    docType: 'workOrder',
    data: {
      name: 'Extrusion Batch Epsilon',
      workCenterId: 'f7ef9888-a8a0-45d9-a3d0-5e08d724cd47',
      status: 'in-progress',
      startDate: '2026-02-16',
      endDate: '2026-02-17',
    },
  },
  {
    docId: '5a3bd828-697f-4667-8d8c-e7e575c4f8ca',
    docType: 'workOrder',
    data: {
      name: 'Extrusion Batch Zeta',
      workCenterId: 'f7ef9888-a8a0-45d9-a3d0-5e08d724cd47',
      status: 'in-progress',
      startDate: '2026-02-19',
      endDate: '2026-02-20',
    },
  },
  {
    docId: 'd15647c4-3b1f-4932-b9cd-60543bf740f0',
    docType: 'workOrder',
    data: {
      name: 'Extrusion Batch Eta',
      workCenterId: 'f7ef9888-a8a0-45d9-a3d0-5e08d724cd47',
      status: 'in-progress',
      startDate: '2026-02-21',
      endDate: '2026-02-22',
    },
  },
  {
    docId: '85a2278a-fa7a-44f0-86b2-b577581cb3c9',
    docType: 'workOrder',
    data: {
      name: 'Extrusion Batch Theta',
      workCenterId: 'f7ef9888-a8a0-45d9-a3d0-5e08d724cd47',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-02-25',
    },
  },
  {
    docId: '0343eba0-596d-491d-aa48-9b4e26892db2',
    docType: 'workOrder',
    data: {
      name: 'CNC Milling Run Alpha',
      workCenterId: 'c6a0c010-4732-4f60-b449-56b9c66af5ff',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-04',
    },
  },
  {
    docId: '9a498ce2-af60-4692-94a9-cdb57058da6e',
    docType: 'workOrder',
    data: {
      name: 'CNC Milling Run Beta',
      workCenterId: 'c6a0c010-4732-4f60-b449-56b9c66af5ff',
      status: 'in-progress',
      startDate: '2026-02-05',
      endDate: '2026-02-06',
    },
  },
  {
    docId: 'aa83ffed-aaa3-47f8-98f3-71baab37574a',
    docType: 'workOrder',
    data: {
      name: 'CNC Milling Run Gamma',
      workCenterId: 'c6a0c010-4732-4f60-b449-56b9c66af5ff',
      status: 'complete',
      startDate: '2026-02-07',
      endDate: '2026-02-08',
    },
  },
  {
    docId: 'fdec3310-49e5-4a1f-a64d-19522d296f16',
    docType: 'workOrder',
    data: {
      name: 'CNC Milling Run Delta',
      workCenterId: 'c6a0c010-4732-4f60-b449-56b9c66af5ff',
      status: 'blocked',
      startDate: '2026-02-09',
      endDate: '2026-02-10',
    },
  },
  {
    docId: '0f92bc2b-936f-4b84-ae8f-c9fd17f4f78c',
    docType: 'workOrder',
    data: {
      name: 'CNC Milling Run Epsilon',
      workCenterId: 'c6a0c010-4732-4f60-b449-56b9c66af5ff',
      status: 'in-progress',
      startDate: '2026-02-16',
      endDate: '2026-02-17',
    },
  },
  {
    docId: '7b4e743f-2ac8-4e6d-be59-5ef50e8580d8',
    docType: 'workOrder',
    data: {
      name: 'CNC Milling Run Zeta',
      workCenterId: 'c6a0c010-4732-4f60-b449-56b9c66af5ff',
      status: 'in-progress',
      startDate: '2026-02-19',
      endDate: '2026-02-20',
    },
  },
  {
    docId: '0dcdb668-6ef4-4e4e-b3ec-cfd3c37f0f7e',
    docType: 'workOrder',
    data: {
      name: 'CNC Milling Run Eta',
      workCenterId: 'c6a0c010-4732-4f60-b449-56b9c66af5ff',
      status: 'in-progress',
      startDate: '2026-02-21',
      endDate: '2026-02-22',
    },
  },
  {
    docId: '9e9116a4-f4b4-4c3b-9f8e-f41018f4b948',
    docType: 'workOrder',
    data: {
      name: 'CNC Milling Run Theta',
      workCenterId: 'c6a0c010-4732-4f60-b449-56b9c66af5ff',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-02-25',
    },
  },
  {
    docId: 'd324cd19-bc5c-490d-b7f4-56919f29f0d8',
    docType: 'workOrder',
    data: {
      name: 'Assembly Order Alpha',
      workCenterId: 'aa2dec9b-bf84-4cd1-a7b5-fe0fdfd43913',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-04',
    },
  },
  {
    docId: '0fb9f5d4-27fd-4816-bac1-33799ea8626c',
    docType: 'workOrder',
    data: {
      name: 'Assembly Order Beta',
      workCenterId: 'aa2dec9b-bf84-4cd1-a7b5-fe0fdfd43913',
      status: 'in-progress',
      startDate: '2026-02-05',
      endDate: '2026-02-06',
    },
  },
  {
    docId: 'a4b75c0c-7cc4-48fa-ae6b-b426cd4a2c51',
    docType: 'workOrder',
    data: {
      name: 'Assembly Order Gamma',
      workCenterId: 'aa2dec9b-bf84-4cd1-a7b5-fe0fdfd43913',
      status: 'complete',
      startDate: '2026-02-07',
      endDate: '2026-02-08',
    },
  },
  {
    docId: 'c75db938-17ac-4935-90c5-fbbe42c91c53',
    docType: 'workOrder',
    data: {
      name: 'Assembly Order Delta',
      workCenterId: 'aa2dec9b-bf84-4cd1-a7b5-fe0fdfd43913',
      status: 'blocked',
      startDate: '2026-02-09',
      endDate: '2026-02-10',
    },
  },
  {
    docId: 'a42f127c-cf88-448c-9e1b-91d527f01f62',
    docType: 'workOrder',
    data: {
      name: 'Assembly Order Epsilon',
      workCenterId: 'aa2dec9b-bf84-4cd1-a7b5-fe0fdfd43913',
      status: 'in-progress',
      startDate: '2026-02-16',
      endDate: '2026-02-17',
    },
  },
  {
    docId: '212bc533-6ac7-4f8d-9b97-bb8cda558d31',
    docType: 'workOrder',
    data: {
      name: 'Assembly Order Zeta',
      workCenterId: 'aa2dec9b-bf84-4cd1-a7b5-fe0fdfd43913',
      status: 'in-progress',
      startDate: '2026-02-19',
      endDate: '2026-02-20',
    },
  },
  {
    docId: 'b7c22955-5372-4630-86dc-6c039bd7c049',
    docType: 'workOrder',
    data: {
      name: 'Assembly Order Eta',
      workCenterId: 'aa2dec9b-bf84-4cd1-a7b5-fe0fdfd43913',
      status: 'in-progress',
      startDate: '2026-02-21',
      endDate: '2026-02-22',
    },
  },
  {
    docId: '08d33fc7-f922-4b2d-a322-69f83d9c9573',
    docType: 'workOrder',
    data: {
      name: 'Assembly Order Theta',
      workCenterId: 'aa2dec9b-bf84-4cd1-a7b5-fe0fdfd43913',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-02-25',
    },
  },
  {
    docId: '2f9ac0b8-1d0a-42ed-b91f-38be4054e563',
    docType: 'workOrder',
    data: {
      name: 'Quality Check Alpha',
      workCenterId: '1aa06bb8-c697-49c8-a1d6-e578c570ee27',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-04',
    },
  },
  {
    docId: '82a25e94-50f9-48fc-9e02-15240b8d8b6e',
    docType: 'workOrder',
    data: {
      name: 'Quality Check Beta',
      workCenterId: '1aa06bb8-c697-49c8-a1d6-e578c570ee27',
      status: 'in-progress',
      startDate: '2026-02-05',
      endDate: '2026-02-06',
    },
  },
  {
    docId: '0128054b-00ad-498a-a892-49d9b33a43dc',
    docType: 'workOrder',
    data: {
      name: 'Quality Check Gamma',
      workCenterId: '1aa06bb8-c697-49c8-a1d6-e578c570ee27',
      status: 'complete',
      startDate: '2026-02-07',
      endDate: '2026-02-08',
    },
  },
  {
    docId: '0f687745-e4e4-4555-9dc2-30c798603386',
    docType: 'workOrder',
    data: {
      name: 'Quality Check Delta',
      workCenterId: '1aa06bb8-c697-49c8-a1d6-e578c570ee27',
      status: 'blocked',
      startDate: '2026-02-09',
      endDate: '2026-02-10',
    },
  },
  {
    docId: '9d7d6aee-7756-4ee6-8ad1-a7b87d3bb326',
    docType: 'workOrder',
    data: {
      name: 'Quality Check Epsilon',
      workCenterId: '1aa06bb8-c697-49c8-a1d6-e578c570ee27',
      status: 'in-progress',
      startDate: '2026-02-16',
      endDate: '2026-02-17',
    },
  },
  {
    docId: 'b62283d6-1c41-401f-99e5-32444a71ce48',
    docType: 'workOrder',
    data: {
      name: 'Quality Check Zeta',
      workCenterId: '1aa06bb8-c697-49c8-a1d6-e578c570ee27',
      status: 'in-progress',
      startDate: '2026-02-19',
      endDate: '2026-02-20',
    },
  },
  {
    docId: '51412482-87ca-4986-96a0-bc35a9f061d0',
    docType: 'workOrder',
    data: {
      name: 'Quality Check Eta',
      workCenterId: '1aa06bb8-c697-49c8-a1d6-e578c570ee27',
      status: 'in-progress',
      startDate: '2026-02-21',
      endDate: '2026-02-22',
    },
  },
  {
    docId: '2cc470d5-f2f8-4ed3-acfc-4e3b21f3ea99',
    docType: 'workOrder',
    data: {
      name: 'Quality Check Theta',
      workCenterId: '1aa06bb8-c697-49c8-a1d6-e578c570ee27',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-02-25',
    },
  },
  {
    docId: 'ae359e5e-0cb7-481e-8d08-a769b12fe28a',
    docType: 'workOrder',
    data: {
      name: 'Packaging Run Alpha',
      workCenterId: '9cd1855b-017d-4dbc-abf0-2adab414efa1',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-04',
    },
  },
  {
    docId: '05ae6c44-e2ee-4e42-ba6f-90a0d0905b01',
    docType: 'workOrder',
    data: {
      name: 'Packaging Run Beta',
      workCenterId: '9cd1855b-017d-4dbc-abf0-2adab414efa1',
      status: 'in-progress',
      startDate: '2026-02-05',
      endDate: '2026-02-06',
    },
  },
  {
    docId: '37300441-a340-45d5-9d41-4143d1cabe55',
    docType: 'workOrder',
    data: {
      name: 'Packaging Run Gamma',
      workCenterId: '9cd1855b-017d-4dbc-abf0-2adab414efa1',
      status: 'complete',
      startDate: '2026-02-07',
      endDate: '2026-02-08',
    },
  },
  {
    docId: '9c5e5525-f440-4e60-a585-0ed5858af475',
    docType: 'workOrder',
    data: {
      name: 'Packaging Run Delta',
      workCenterId: '9cd1855b-017d-4dbc-abf0-2adab414efa1',
      status: 'blocked',
      startDate: '2026-02-09',
      endDate: '2026-02-10',
    },
  },
  {
    docId: 'bde95026-3bc0-47c0-8e3d-f34aa5771181',
    docType: 'workOrder',
    data: {
      name: 'Packaging Run Epsilon',
      workCenterId: '9cd1855b-017d-4dbc-abf0-2adab414efa1',
      status: 'in-progress',
      startDate: '2026-02-16',
      endDate: '2026-02-17',
    },
  },
  {
    docId: '37dca6ef-647a-4360-9e02-9ef84e5ee543',
    docType: 'workOrder',
    data: {
      name: 'Packaging Run Zeta',
      workCenterId: '9cd1855b-017d-4dbc-abf0-2adab414efa1',
      status: 'in-progress',
      startDate: '2026-02-19',
      endDate: '2026-02-20',
    },
  },
  {
    docId: 'eca8ff2a-fc00-45a3-ba6e-e4af80c83879',
    docType: 'workOrder',
    data: {
      name: 'Packaging Run Eta',
      workCenterId: '9cd1855b-017d-4dbc-abf0-2adab414efa1',
      status: 'in-progress',
      startDate: '2026-02-21',
      endDate: '2026-02-22',
    },
  },
  {
    docId: '901a217c-6405-4fc0-bc6a-d96a10abc68f',
    docType: 'workOrder',
    data: {
      name: 'Packaging Run Theta',
      workCenterId: '9cd1855b-017d-4dbc-abf0-2adab414efa1',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-02-25',
    },
  },
  {
    docId: 'f5d268f0-99de-40de-bb4e-ff3ed1c428d9',
    docType: 'workOrder',
    data: {
      name: 'Shipping Lot Alpha',
      workCenterId: 'e1894d1f-65c5-465a-bf00-2d865d22bb33',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-04',
    },
  },
  {
    docId: '12385c4c-77f6-48d5-87dc-c32689385430',
    docType: 'workOrder',
    data: {
      name: 'Shipping Lot Beta',
      workCenterId: 'e1894d1f-65c5-465a-bf00-2d865d22bb33',
      status: 'in-progress',
      startDate: '2026-02-05',
      endDate: '2026-02-06',
    },
  },
  {
    docId: 'af787633-fb9f-49d7-a910-b9e7e89c92fa',
    docType: 'workOrder',
    data: {
      name: 'Shipping Lot Gamma',
      workCenterId: 'e1894d1f-65c5-465a-bf00-2d865d22bb33',
      status: 'complete',
      startDate: '2026-02-07',
      endDate: '2026-02-08',
    },
  },
  {
    docId: '0c630d4f-405c-4b92-8dfd-85ecb237cf0c',
    docType: 'workOrder',
    data: {
      name: 'Shipping Lot Delta',
      workCenterId: 'e1894d1f-65c5-465a-bf00-2d865d22bb33',
      status: 'blocked',
      startDate: '2026-02-09',
      endDate: '2026-02-10',
    },
  },
  {
    docId: '1fb5cd54-d089-45a5-94d1-7b7cb9d80a8c',
    docType: 'workOrder',
    data: {
      name: 'Shipping Lot Epsilon',
      workCenterId: 'e1894d1f-65c5-465a-bf00-2d865d22bb33',
      status: 'in-progress',
      startDate: '2026-02-16',
      endDate: '2026-02-17',
    },
  },
  {
    docId: '17f73c15-7295-4374-b4a2-86e68556a6fa',
    docType: 'workOrder',
    data: {
      name: 'Shipping Lot Zeta',
      workCenterId: 'e1894d1f-65c5-465a-bf00-2d865d22bb33',
      status: 'in-progress',
      startDate: '2026-02-19',
      endDate: '2026-02-20',
    },
  },
  {
    docId: 'e5161009-e413-4111-b4a8-a58a80a551ad',
    docType: 'workOrder',
    data: {
      name: 'Shipping Lot Eta',
      workCenterId: 'e1894d1f-65c5-465a-bf00-2d865d22bb33',
      status: 'in-progress',
      startDate: '2026-02-21',
      endDate: '2026-02-22',
    },
  },
  {
    docId: '2eefc907-f4b3-4807-a4fc-3a4324892417',
    docType: 'workOrder',
    data: {
      name: 'Shipping Lot Theta',
      workCenterId: 'e1894d1f-65c5-465a-bf00-2d865d22bb33',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-02-25',
    },
  },
];
