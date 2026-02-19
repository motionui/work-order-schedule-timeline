/**
 * Define the structure of a work center document in the application
 */

import { DocumentType } from './doc-type.model';

export interface WorkCenterDocument {
  docId: string;
  docType: DocumentType;
  data: {
    name: string;
  };
}
