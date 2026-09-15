import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ClinicDataService } from '../../core/services/clinic-data.service';
import { StaffMember } from '../../core/models/clinic.models';
import { TransPipe } from '../../core/pipes/trans.pipe';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, TransPipe],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffComponent {
  readonly clinic = inject(ClinicDataService);

  searchQuery = signal('');
  showAddDialog = signal(false);

  newStaff: Partial<StaffMember> = {
    name: '',
    role: 'Doctor',
    phone: '',
    email: '',
    status: 'Active'
  };

  filteredStaff = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.clinic.staff();
    return this.clinic.staff().filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q) ||
      s.phone.includes(q)
    );
  });

  openAddDialog() {
    this.newStaff = {
      name: '',
      role: 'Doctor',
      phone: '',
      email: '',
      status: 'Active'
    };
    this.showAddDialog.set(true);
  }

  saveStaff() {
    if (!this.newStaff.name || !this.newStaff.phone) return;
    this.clinic.addStaff({
      name: this.newStaff.name!,
      role: this.newStaff.role || 'Doctor',
      phone: this.newStaff.phone!,
      email: this.newStaff.email || 'staff@lumiere.com',
      status: 'Active'
    });
    this.showAddDialog.set(false);
  }
}
