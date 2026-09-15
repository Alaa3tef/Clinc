import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ClinicDataService } from '../../core/services/clinic-data.service';
import { Appointment } from '../../core/models/clinic.models';
import { TransPipe } from '../../core/pipes/trans.pipe';

interface TimeSlot {
  time: string;
  appointments: Record<string, Appointment | undefined>;
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TransPipe],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent {
  readonly clinic = inject(ClinicDataService);

  activeView = signal<'Day' | 'Week' | 'Month'>('Week');
  currentMonth = signal('');

  // Quick Book Form Data
  selectedPatientName = '';
  selectedTreatmentName = '';
  selectedStaffName = '';
  selectedDate = '';
  selectedTime = '';
  selectedRoom = '';

  daysOfWeek: { name: string; date: string; full: string }[] = [];

  timeSlots: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  // Scheduled events on calendar dynamically mapped from backend API appointments
  get scheduledEvents(): Record<string, { patient: string; treatment: string; color: string }> {
    const map: Record<string, { patient: string; treatment: string; color: string }> = {};
    const colors = ['#e3f2fd', '#e8f5e9', '#fce4ec', '#ede7f6', '#fff3e0'];
    this.clinic.appointments().forEach((apt, idx) => {
      if (apt.date && apt.time) {
        const key = `${apt.date}_${apt.time}`;
        map[key] = {
          patient: apt.patientName,
          treatment: apt.treatment,
          color: colors[idx % colors.length]
        };
      }
    });
    return map;
  }

  rooms: string[] = [];

  constructor() {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    this.currentMonth.set(weekStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }));
    this.daysOfWeek = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + index);
      return {
        name: day.toLocaleDateString(undefined, { weekday: 'short' }),
        date: String(day.getDate()),
        full: this.toDateValue(day)
      };
    });
    this.selectedDate = this.toDateValue(today);
  }

  private toDateValue(date: Date) {
    return date.toISOString().split('T')[0];
  }

  bookQuickAppointment() {
    if (!this.selectedPatientName || !this.selectedTreatmentName) return;
    const treatment = this.clinic.treatments().find(item => item.name === this.selectedTreatmentName);
    this.clinic.addAppointment({
      patientName: this.selectedPatientName,
      treatment: this.selectedTreatmentName,
      date: this.selectedDate,
      time: this.selectedTime,
      room: this.selectedRoom,
      status: 'Confirmed',
      price: treatment?.price
    });
    // Reset inputs
    this.selectedPatientName = '';
    this.selectedTreatmentName = '';
  }
}
