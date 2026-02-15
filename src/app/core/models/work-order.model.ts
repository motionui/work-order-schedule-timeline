import { DocumentType } from './doc-type.model';

export const WORK_ORDER_STATUS: Record<string, string> = {
  open: 'Open',
  'in-progress': 'In progress',
  complete: 'Complete',
  blocked: 'Blocked',
} as const;

export type WorkOrderStatus = keyof typeof WORK_ORDER_STATUS;

export const WORK_ORDER_STATUS_OPTIONS = Object.entries(WORK_ORDER_STATUS).map(([value, label]) => ({
  value: value as WorkOrderStatus,
  label,
}));

export interface WorkOrderDocument {
  docId: string;
  docType: DocumentType;
  data: {
    name: string;
    workCenterId: string; // References WorkCenterDocument.docId
    status: WorkOrderStatus;
    startDate: string; // ISO format (e.g., "2025-01-15")
    endDate: string; // ISO format
  };
}
