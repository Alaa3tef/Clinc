import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'patients',
    loadComponent: () => import('./features/patients/patients.component').then(m => m.PatientsComponent)
  },
  {
    path: 'appointments',
    loadComponent: () => import('./features/appointments/appointments.component').then(m => m.AppointmentsComponent)
  },
  {
    path: 'treatments',
    loadComponent: () => import('./features/treatments/treatments.component').then(m => m.TreatmentsComponent)
  },
  {
    path: 'sessions',
    loadComponent: () => import('./features/sessions/sessions.component').then(m => m.SessionsComponent)
  },
  {
    path: 'devices',
    loadComponent: () => import('./features/devices/devices.component').then(m => m.DevicesComponent)
  },
  {
    path: 'payments',
    loadComponent: () => import('./features/payments/payments.component').then(m => m.PaymentsComponent)
  },
  {
    path: 'staff',
    loadComponent: () => import('./features/staff/staff.component').then(m => m.StaffComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
