import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../core/services/translation.service';
import { ClinicDataService } from '../../../core/services/clinic-data.service';
import { TransPipe } from '../../../core/pipes/trans.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, TransPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly trans = inject(TranslationService);
  readonly clinic = inject(ClinicDataService);
  searchQuery = '';
}
