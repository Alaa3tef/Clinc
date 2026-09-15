import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ClinicDataService } from '../../core/services/clinic-data.service';
import { Invoice } from '../../core/models/clinic.models';
import { TransPipe } from '../../core/pipes/trans.pipe';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, TransPipe],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {
  readonly clinic = inject(ClinicDataService);

  searchQuery = signal('');
  showAddDialog = signal(false);

  newInvoice: Partial<Invoice> = {
    patientName: '',
    amount: 1000,
    status: 'Paid'
  };

  filteredInvoices = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.clinic.invoices();
    return this.clinic.invoices().filter(inv =>
      inv.patientName.toLowerCase().includes(q) ||
      inv.invoiceNo.toLowerCase().includes(q)
    );
  });

  openAddDialog() {
    this.newInvoice = {
      patientName: '',
      amount: 1000,
      status: 'Paid'
    };
    this.showAddDialog.set(true);
  }

  saveInvoice() {
    if (!this.newInvoice.patientName || !this.newInvoice.amount) return;
    const invCount = this.clinic.invoices().length + 1;
    this.clinic.addInvoice({
      invoiceNo: `INV-${String(invCount).padStart(4, '0')}`,
      patientName: this.newInvoice.patientName!,
      date: new Date().toISOString().split('T')[0],
      amount: Number(this.newInvoice.amount),
      status: this.newInvoice.status || 'Paid'
    });
    this.showAddDialog.set(false);
  }
}
