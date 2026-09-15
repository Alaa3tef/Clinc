import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ClinicDataService } from '../../core/services/clinic-data.service';
import { TransPipe } from '../../core/pipes/trans.pipe';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TransPipe],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss'
})
export class SessionsComponent {
  readonly clinic = inject(ClinicDataService);

  activeTab = signal<'details' | 'parameters' | 'beforeAfter' | 'notes'>('parameters');
  session = this.clinic.currentSession;
}
