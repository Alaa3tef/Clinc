import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';
import { ClinicDataService } from '../../../core/services/clinic-data.service';
import { TransPipe } from '../../../core/pipes/trans.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TransPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  private clinic = inject(ClinicDataService);
  readonly trans = inject(TranslationService);

  emailOrPhone = '';
  password = '';
  rememberMe = false;
  loginError = signal(false);
  isSubmitting = signal(false);

  onLogin() {
    if (!this.emailOrPhone || !this.password || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.loginError.set(false);
    this.clinic.login(this.emailOrPhone, this.password).subscribe({
      next: response => {
        const token = response.token || response.accessToken;
        if (token) localStorage.setItem('clinic_access_token', token);
        this.clinic.loadAllData();
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loginError.set(true);
        this.isSubmitting.set(false);
      }
    });
  }
}
