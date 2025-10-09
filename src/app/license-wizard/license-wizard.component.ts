import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LicenseFormData {
  // Step 1
  licenseReference: string;
  issuingAgency: string;
  issueDate: string;
  expirationDate: string;
  licenseDescription?: string;
  countryOfExport: string;
  licenseCurrency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | '';
  authorizedLicensee: 'Exporter' | 'Shipper' | 'Manufacturer' | '';

  // Step 2
  trackUsageBy: 'Party' | 'Country' | '';
  trackItemsBy: 'ECCN' | 'HS Code' | '';
  licenseLimit: 'Value' | 'Quantity' | 'Both' | '';
  decrementType: 'Delivery' | 'Pick Slip' | 'Sales Order' | 'Shipment' | '';
  enableHeaderLevelTracking: boolean;
  totalLicensedQuantity?: string; // keep as string to bind to input
  totalLicensedValue?: string;    // keep as string to bind to input
  remainingQuantityAvailable?: number | string;
  remainingValueAvailable?: number | string;
  usedQuantity?: number;
  usedValue?: number;
}

@Component({
  selector: 'app-license-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './license-wizard.component.html',
  styleUrls: ['./license-wizard.component.css'],
})
export class LicenseWizardComponent {
  currentStep = 1;
  isSubmitted = false;

  formData: LicenseFormData = {
    // Step 1 defaults
    licenseReference: 'LIC-2024-USA-00892',
    issuingAgency: 'DOS',
    issueDate: '2024-01-15',
    expirationDate: '2025-01-14',
    licenseDescription:
      'Export license for aerospace components and related defense articles to approved NATO member countries',
    countryOfExport: 'United States',
    licenseCurrency: 'USD',
    authorizedLicensee: 'Exporter',

    // Step 2 defaults
    trackUsageBy: 'Party',
    trackItemsBy: 'ECCN',
    licenseLimit: 'Both',
    decrementType: 'Shipment',
    enableHeaderLevelTracking: true,
    totalLicensedQuantity: '5000',
    totalLicensedValue: '2500000',
    remainingQuantityAvailable: '5000',
    remainingValueAvailable: '2500000',
    usedQuantity: 0,
    usedValue: 0,
  };

  errors: Record<string, string> = {};

  get currencySymbol(): string {
    switch (this.formData.licenseCurrency) {
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'JPY':
        return '¥';
      default:
        return '$';
    }
  }

  handleChange(field: keyof LicenseFormData, value: any): void {
    // Assign and recalculate dependent values
    (this.formData as any)[field] = value;
    this.recalculateTotals();
  }

  private safeParseFloat(value: any): number {
    const n = parseFloat(value as string);
    return Number.isFinite(n) ? n : 0;
  }

  private recalculateTotals(): void {
    if (this.formData.enableHeaderLevelTracking) {
      if (this.formData.totalLicensedQuantity !== undefined) {
        const totalQty = this.safeParseFloat(this.formData.totalLicensedQuantity);
        const usedQty = this.safeParseFloat(this.formData.usedQuantity ?? 0);
        const remainingQty = totalQty - usedQty;
        this.formData.remainingQuantityAvailable = remainingQty >= 0 ? remainingQty : 0;
      }

      if (this.formData.totalLicensedValue !== undefined) {
        const totalVal = this.safeParseFloat(this.formData.totalLicensedValue);
        const usedVal = this.safeParseFloat(this.formData.usedValue ?? 0);
        const remainingVal = totalVal - usedVal;
        this.formData.remainingValueAvailable = remainingVal >= 0 ? remainingVal.toFixed(2) : 0;
      }
    }
  }

  validateStep(step: number): boolean {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!this.formData.licenseReference) newErrors['licenseReference'] = 'Required';
      if (!this.formData.issuingAgency) newErrors['issuingAgency'] = 'Required';
      if (!this.formData.issueDate) newErrors['issueDate'] = 'Required';
      if (!this.formData.expirationDate) newErrors['expirationDate'] = 'Required';
      if (!this.formData.countryOfExport) newErrors['countryOfExport'] = 'Required';
      if (!this.formData.licenseCurrency) newErrors['licenseCurrency'] = 'Required';
      if (!this.formData.authorizedLicensee) newErrors['authorizedLicensee'] = 'Required';

      if (
        this.formData.issueDate &&
        this.formData.expirationDate &&
        new Date(this.formData.expirationDate) <= new Date(this.formData.issueDate)
      ) {
        newErrors['expirationDate'] = 'Must be after Issue Date';
      }
    }

    if (step === 2) {
      if (!this.formData.trackUsageBy) newErrors['trackUsageBy'] = 'Required';
      if (!this.formData.trackItemsBy) newErrors['trackItemsBy'] = 'Required';
      if (!this.formData.licenseLimit) newErrors['licenseLimit'] = 'Required';
      if (!this.formData.decrementType) newErrors['decrementType'] = 'Required';

      if (this.formData.enableHeaderLevelTracking) {
        if (!this.formData.totalLicensedQuantity)
          newErrors['totalLicensedQuantity'] = 'Required when Header-Level Tracking is enabled';
        if (!this.formData.totalLicensedValue)
          newErrors['totalLicensedValue'] = 'Required when Header-Level Tracking is enabled';
      }
    }

    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  handleNext(): void {
    if (this.validateStep(this.currentStep)) {
      this.currentStep += 1;
    }
  }

  handleBack(): void {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
      this.errors = {};
    }
  }

  handleSubmit(): void {
    if (this.validateStep(this.currentStep)) {
      this.isSubmitted = true;
    }
  }

  handleEdit(): void {
    this.isSubmitted = false;
    this.currentStep = 1;
  }

  formatCurrency(value: number | string | undefined): string {
    const n = this.safeParseFloat(value ?? 0);
    const symbol = this.currencySymbol;
    return `${symbol}${n.toLocaleString()}`;
  }
}
