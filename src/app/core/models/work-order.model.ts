import { DocumentType } from './doc-type.model';

// Define constants and types related to work orders in the application
export const WORK_ORDER_STATUS: Record<string, string> = {
  open: 'Open',
  'in-progress': 'In progress',
  complete: 'Complete',
  blocked: 'Blocked',
} as const;

// Define a type for work order status based on the keys of WORK_ORDER_STATUS
export type WorkOrderStatus = keyof typeof WORK_ORDER_STATUS;

// Define the record as an array of value-label pairs for use in form options
export const WORK_ORDER_STATUS_OPTIONS = Object.entries(WORK_ORDER_STATUS).map(([value, label]) => ({
  value: value as WorkOrderStatus,
  label,
}));

// Define the structure of a work order document in the application
export interface WorkOrderDocument {
  docId: string;
  docType: DocumentType;
  data: {
    name: string;
    // References WorkCenterDocument.docId
    workCenterId: string;
    status: WorkOrderStatus;
    // ISO format (e.g., "2025-01-15")
    startDate: string;
    endDate: string;
  };
}
