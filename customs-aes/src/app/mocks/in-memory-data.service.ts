import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const shipments = [
      { id: 'RC6920252', itnNumber: null, shipDate: '2025-06-15', destination: 'Canada', status: 'REVIEW' },
      { id: 'US-MX-EAR99-NLR', itnNumber: null, shipDate: null, destination: 'Canada', status: 'HOLD' },
      { id: 'RC6920251', itnNumber: null, shipDate: '2025-06-12', destination: 'Canada', status: 'HOLD' },
    ];
    return { shipments };
  }

  // Basic pagination + filtering on the GET collection route
  get(reqInfo: RequestInfo) {
    if (reqInfo.collectionName === 'shipments') {
      const url = new URL(reqInfo.req.url);
      const pageIndex = Number(url.searchParams.get('pageIndex') || '0');
      const pageSize = Number(url.searchParams.get('pageSize') || '10');
      const search = (url.searchParams.get('search') || '').toLowerCase();
      const quick = url.searchParams.get('quick') || 'all';

      let data = [...(reqInfo.collection as any[])];
      if (search) {
        data = data.filter(d => Object.values(d).join(' ').toLowerCase().includes(search));
      }
      if (quick !== 'all') {
        if (quick === 'hold') data = data.filter(d => d.status === 'HOLD');
        if (quick === 'open') data = data.filter(d => d.status === 'OPEN');
        if (quick === 'pending') data = data.filter(d => d.status === 'PENDING');
      }
      const total = data.length;
      const start = pageIndex * pageSize;
      const end = start + pageSize;
      const items = data.slice(start, end);
      return reqInfo.utils.createResponse$(() => ({
        body: { items, total },
        status: 200,
      }));
    }
    return undefined;
  }
}

