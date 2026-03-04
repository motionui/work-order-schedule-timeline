import { Injectable } from '@angular/core';

import { Observable, defer, of, throwError } from 'rxjs';
import { WorkCenterDocument } from '../models/work-center.model';
import { WorkOrderDocument } from '../models/work-order.model';
import { SAMPLE_WORK_CENTERS, SAMPLE_WORK_ORDERS } from './mock-data';
import { WorkOrdersRepository } from './work-orders-repostory';

const STORAGE_KEYS = {
  workCenters: 'naologic.work-centers',
  workOrders: 'naologic.work-orders',
} as const;

@Injectable()
export class LocalStorageRepository extends WorkOrdersRepository {
  protected fetchWorkCenters(): Observable<WorkCenterDocument[]> {
    return defer(() => {
      this.ensureSeedData();
      return of(this.readWorkCenters());
    });
  }

  protected fetchWorkOrders(): Observable<WorkOrderDocument[]> {
    return defer(() => {
      this.ensureSeedData();
      return of(this.readWorkOrders());
    });
  }

  protected persistAdd(workOrder: WorkOrderDocument): Observable<WorkOrderDocument> {
    return defer(() => {
      this.ensureSeedData();
      const nextWorkOrders = [...this.readWorkOrders(), this.clone(workOrder)];
      this.writeWorkOrders(nextWorkOrders);
      return of(this.clone(workOrder));
    });
  }

  protected persistUpdate(workOrder: WorkOrderDocument): Observable<WorkOrderDocument> {
    return defer(() => {
      this.ensureSeedData();
      const current = this.readWorkOrders();
      const nextWorkOrders = current.map((existing) => (existing.docId === workOrder.docId ? this.clone(workOrder) : existing));

      if (current.length === nextWorkOrders.length && !current.some((existing) => existing.docId === workOrder.docId)) {
        return throwError(() => new Error(`Cannot update missing work order: ${workOrder.docId}`));
      }

      this.writeWorkOrders(nextWorkOrders);
      return of(this.clone(workOrder));
    });
  }

  protected persistDelete(workOrder: WorkOrderDocument): Observable<void> {
    return defer(() => {
      this.ensureSeedData();
      const nextWorkOrders = this.readWorkOrders().filter((existing) => existing.docId !== workOrder.docId);
      this.writeWorkOrders(nextWorkOrders);
      return of(void 0);
    });
  }

  private ensureSeedData(): void {
    if (!this.isStorageAvailable()) {
      return;
    }

    const workCenters = this.readFromStorage<WorkCenterDocument[]>(STORAGE_KEYS.workCenters);
    if (!workCenters) {
      this.writeToStorage(STORAGE_KEYS.workCenters, this.clone(SAMPLE_WORK_CENTERS));
    }

    const workOrders = this.readFromStorage<WorkOrderDocument[]>(STORAGE_KEYS.workOrders);
    if (!workOrders) {
      this.writeToStorage(STORAGE_KEYS.workOrders, this.clone(SAMPLE_WORK_ORDERS));
    }
  }

  private readWorkCenters(): WorkCenterDocument[] {
    if (!this.isStorageAvailable()) {
      return this.clone(SAMPLE_WORK_CENTERS);
    }

    return this.readFromStorage<WorkCenterDocument[]>(STORAGE_KEYS.workCenters) ?? this.clone(SAMPLE_WORK_CENTERS);
  }

  private readWorkOrders(): WorkOrderDocument[] {
    if (!this.isStorageAvailable()) {
      return this.clone(SAMPLE_WORK_ORDERS);
    }

    return this.readFromStorage<WorkOrderDocument[]>(STORAGE_KEYS.workOrders) ?? this.clone(SAMPLE_WORK_ORDERS);
  }

  private writeWorkOrders(workOrders: WorkOrderDocument[]): void {
    if (!this.isStorageAvailable()) {
      return;
    }

    this.writeToStorage(STORAGE_KEYS.workOrders, this.clone(workOrders));
  }

  private readFromStorage<T>(key: string): T | null {
    try {
      const payload = localStorage.getItem(key);
      if (!payload) {
        return null;
      }

      return JSON.parse(payload) as T;
    } catch {
      return null;
    }
  }

  private writeToStorage<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private isStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}
