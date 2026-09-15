import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ClinicDataService } from '../../core/services/clinic-data.service';
import { LaserDevice } from '../../core/models/clinic.models';
import { TransPipe } from '../../core/pipes/trans.pipe';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, TransPipe],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent {
  readonly clinic = inject(ClinicDataService);

  showAddDialog = signal(false);
  newDevice: Partial<LaserDevice> = {
    name: '',
    manufacturer: '',
    model: '',
    room: 'Room 1',
    maintenanceStatus: 'Optimal'
  };

  openAddDialog() {
    this.newDevice = {
      name: '',
      manufacturer: '',
      model: '',
      room: 'Room 1',
      maintenanceStatus: 'Optimal'
    };
    this.showAddDialog.set(true);
  }

  saveDevice() {
    if (!this.newDevice.name) return;
    this.clinic.addDevice({
      name: this.newDevice.name!,
      manufacturer: this.newDevice.manufacturer || 'General',
      model: this.newDevice.model || 'Model-X',
      room: this.newDevice.room || 'Room 1',
      maintenanceStatus: 'Optimal'
    });
    this.showAddDialog.set(false);
  }
}
