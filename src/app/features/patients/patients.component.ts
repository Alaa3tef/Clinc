import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ClinicDataService } from '../../core/services/clinic-data.service';
import { Patient } from '../../core/models/clinic.models';
import { TransPipe } from '../../core/pipes/trans.pipe';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, TransPipe],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss'
})
export class PatientsComponent {
  readonly clinic = inject(ClinicDataService);

  searchQuery = signal('');
  selectedPatient = signal<Patient | null>(null);
  activeTab = signal<'personal' | 'medical' | 'treatments' | 'appointments' | 'payments' | 'notes'>('personal');

  showAddDialog = signal(false);
  newPatient: Partial<Patient> = {
    name: '',
    phone: '',
    email: '',
    status: 'Active',
    isVip: false
  };

  constructor() {
    effect(() => {
      const list = this.clinic.patients();
      if (list.length > 0 && !this.selectedPatient()) {
        this.selectedPatient.set(list[0]);
      }
    });
  }

  filteredPatients = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.clinic.patients();
    return this.clinic.patients().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  });

  selectPatient(p: Patient) {
    this.selectedPatient.set(p);
  }

  openAddPatient() {
    this.newPatient = {
      name: '',
      phone: '',
      email: '',
      status: 'Active',
      isVip: false
    };
    this.showAddDialog.set(true);
  }

  savePatient() {
    if (!this.newPatient.name || !this.newPatient.phone) return;
    this.clinic.addPatient({
      name: this.newPatient.name!,
      phone: this.newPatient.phone!,
      email: this.newPatient.email || '',
      lastVisit: new Date().toISOString().split('T')[0],
      status: this.newPatient.status || 'Active',
      isVip: this.newPatient.isVip || false
    });
    this.showAddDialog.set(false);
  }
}
