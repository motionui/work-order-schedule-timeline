import { DocumentType } from './document-type.model';

export interface WorkCenterDocument {
  docId: string;
  docType: DocumentType;
  data: {
    name: string;
  };
}
