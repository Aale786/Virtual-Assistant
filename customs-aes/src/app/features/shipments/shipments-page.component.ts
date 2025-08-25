import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Shipment, ShipmentsService } from './shipments.service';

@Component({
  selector: 'app-shipments-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTableModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './shipments-page.component.html',
  styleUrls: ['./shipments-page.component.css']
})
export class ShipmentsPageComponent {
  private service = inject(ShipmentsService);

  shipments = signal<Shipment[]>([]);
  total = signal(0);
  pageIndex = signal(0);
  pageSize = signal(10);
  search = signal('');
  quick = signal<'all'|'hold'|'open'|'pending'|'pick'|'so'|'shipment'|'delivery'>('all');

  constructor() {
    effect(() => {
      this.load();
    });
  }

  setQuick(value: typeof this.quick extends infer T ? any : never): void {
    this.quick.set(value as any);
    this.pageIndex.set(0);
    this.load();
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.pageIndex.set(0);
    this.load();
  }

  load(): void {
    this.service.getShipments({
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      search: this.search(),
      quick: this.quick(),
    }).subscribe(r => {
      this.shipments.set(r.items);
      this.total.set(r.total);
    });
  }

  onPage(ev: PageEvent): void {
    this.pageIndex.set(ev.pageIndex);
    this.pageSize.set(ev.pageSize);
    this.load();
  }

  trackById(index: number, item: Shipment): string {
    return item.id;
  }
}

