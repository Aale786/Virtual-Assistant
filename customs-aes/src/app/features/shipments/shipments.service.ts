import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Shipment {
  id: string;
  itnNumber: string | null;
  shipDate: string | null;
  destination: string;
  status: 'HOLD' | 'OPEN' | 'PENDING' | 'REVIEW';
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ShipmentsService {
  private http = inject(HttpClient);

  getShipments(args: { pageIndex: number; pageSize: number; search?: string; quick?: string; }): Observable<PagedResult<Shipment>> {
    let params = new HttpParams()
      .set('pageIndex', args.pageIndex)
      .set('pageSize', args.pageSize)
      .set('search', args.search ?? '')
      .set('quick', args.quick ?? 'all');
    return this.http.get<PagedResult<Shipment>>('/api/shipments', { params });
  }

  createShipment(s: Omit<Shipment, 'id'>): Observable<Shipment> {
    return this.http.post<Shipment>('/api/shipments', s);
  }

  updateShipment(id: string, s: Partial<Shipment>): Observable<Shipment> {
    return this.http.put<Shipment>(`/api/shipments/${id}`, s);
  }

  deleteShipment(id: string): Observable<void> {
    return this.http.delete<void>(`/api/shipments/${id}`);
  }
}

