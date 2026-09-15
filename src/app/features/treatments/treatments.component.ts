import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ClinicDataService } from '../../core/services/clinic-data.service';
import { Treatment } from '../../core/models/clinic.models';
import { TransPipe } from '../../core/pipes/trans.pipe';

@Component({
  selector: 'app-treatments',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, TransPipe],
  templateUrl: './treatments.component.html',
  styleUrl: './treatments.component.scss'
})
export class TreatmentsComponent {
  readonly clinic = inject(ClinicDataService);

  searchQuery = signal('');
  showAddDialog = signal(false);

  newTreatment: Partial<Treatment> = {
    name: '',
    category: 'Laser',
    durationMinutes: 30,
    price: 1000,
    status: 'Active'
  };

  filteredTreatments = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.clinic.treatments();
    return this.clinic.treatments().filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  openAddDialog() {
    this.newTreatment = {
      name: '',
      category: 'Laser',
      durationMinutes: 30,
      price: 1000,
      status: 'Active'
    };
    this.showAddDialog.set(true);
  }

  saveTreatment() {
    if (!this.newTreatment.name || !this.newTreatment.price) return;
    this.clinic.addTreatment({
      name: this.newTreatment.name!,
      category: this.newTreatment.category || 'Laser',
      durationMinutes: this.newTreatment.durationMinutes || 30,
      price: Number(this.newTreatment.price),
      status: 'Active'
    });
    this.showAddDialog.set(false);
  }
}
