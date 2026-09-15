import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Patient,
  Appointment,
  Treatment,
  LaserDevice,
  LaserSession,
  Invoice,
  StaffMember,
  DashboardKPIs,
  DashboardRevenuePoint,
  DashboardCategoryPoint,
  DashboardAppointment
} from '../models/clinic.models';

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  user?: StaffMember;
}

@Injectable({
  providedIn: 'root'
})
export class ClinicDataService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Signals initialized with empty state (No static data)
  readonly kpis = signal<DashboardKPIs>({
    totalPatients: 0,
    patientsGrowth: '0%',
    todayAppointments: 0,
    appointmentsDiff: '0',
    todayRevenue: 0,
    revenueGrowth: '0%',
    pendingPayments: 0,
    pendingDiff: '0%'
  });

  readonly patients = signal<Patient[]>([]);
  readonly appointments = signal<Appointment[]>([]);
  readonly treatments = signal<Treatment[]>([]);
  readonly devices = signal<LaserDevice[]>([]);
  readonly invoices = signal<Invoice[]>([]);
  readonly staff = signal<StaffMember[]>([]);
  readonly upcomingAppointments = signal<DashboardAppointment[]>([]);
  readonly currentUser = signal<StaffMember | null>(null);
  readonly revenuePoints = signal<DashboardRevenuePoint[]>([]);
  readonly categoryPoints = signal<DashboardCategoryPoint[]>([]);

  readonly currentSession = signal<LaserSession>({
    id: '',
    patientId: '',
    patientName: 'No Active Session',
    treatmentName: '',
    sessionNumber: 0,
    totalSessions: 0,
    date: '',
    time: '',
    area: '',
    deviceName: '',
    technicianName: '',
    room: '',
    durationMinutes: 0,
    parameters: {
      energy: '-',
      pulseDuration: '-',
      frequency: '-',
      spotSize: '-',
      coolingLevel: '-',
      skinType: '-'
    },
    notes: ''
  });

  constructor() {
    this.loadAllData();
  }

  /**
   * Load all datasets directly from Swagger API endpoints
   */
  loadAllData() {
    this.loadKPIs();
    this.loadPatients();
    this.loadAppointments();
    this.loadTreatments();
    this.loadDevices();
    this.loadInvoices();
    this.loadStaff();
    this.loadActiveSession();
    this.loadUpcomingAppointments();
  }

  login(emailOrPhone: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Auth/login`, {
      emailOrPhone,
      password
    }).pipe(
      tap(response => response.user && this.currentUser.set(response.user))
    );
  }

  loadKPIs() {
    this.http.get<DashboardKPIs>(`${this.apiUrl}/Dashboard/stats`).pipe(
      tap(data => data && this.kpis.set(data)),
      catchError(err => {
        console.error('Error fetching /api/Dashboard/stats from Swagger:', err);
        return of(null);
      })
    ).subscribe();
  }

  loadPatients() {
    this.http.get<Patient[]>(`${this.apiUrl}/Patients`).pipe(
      tap(data => Array.isArray(data) && this.patients.set(data)),
      catchError(err => {
        console.error('Error fetching /api/Patients from Swagger:', err);
        return of(null);
      })
    ).subscribe();
  }

  loadAppointments() {
    this.http.get<Appointment[]>(`${this.apiUrl}/Appointments`).pipe(
      tap(data => Array.isArray(data) && this.appointments.set(data)),
      catchError(err => {
        console.error('Error fetching /api/Appointments from Swagger:', err);
        return of(null);
      })
    ).subscribe();
  }

  loadTreatments() {
    this.http.get<Treatment[]>(`${this.apiUrl}/Treatments`).pipe(
      tap(data => Array.isArray(data) && this.treatments.set(data)),
      catchError(err => {
        console.error('Error fetching /api/Treatments from Swagger:', err);
        return of(null);
      })
    ).subscribe();
  }

  loadDevices() {
    this.http.get<LaserDevice[]>(`${this.apiUrl}/Devices`).pipe(
      tap(data => Array.isArray(data) && this.devices.set(data)),
      catchError(err => {
        console.error('Error fetching /api/Devices from Swagger:', err);
        return of(null);
      })
    ).subscribe();
  }

  loadInvoices() {
    this.http.get<Invoice[]>(`${this.apiUrl}/Invoices`).pipe(
      tap(data => Array.isArray(data) && this.invoices.set(data)),
      catchError(err => {
        console.error('Error fetching /api/Invoices from Swagger:', err);
        return of(null);
      })
    ).subscribe();
  }

  loadStaff() {
    this.http.get<StaffMember[]>(`${this.apiUrl}/Staff`).pipe(
      tap(data => Array.isArray(data) && this.staff.set(data)),
      catchError(err => {
        console.error('Error fetching /api/Staff from Swagger:', err);
        return of(null);
      })
    ).subscribe();
  }

  loadActiveSession() {
    this.http.get<LaserSession>(`${this.apiUrl}/Sessions/active`).pipe(
      tap(data => data && this.currentSession.set(data)),
      catchError(() => {
        return this.http.get<LaserSession[]>(`${this.apiUrl}/Sessions`).pipe(
          tap(list => Array.isArray(list) && list.length && this.currentSession.set(list[0])),
          catchError(err => {
            console.error('Error fetching /api/Sessions from Swagger:', err);
            return of(null);
          })
        );
      })
    ).subscribe();
  }

  // API Mutation Actions (POST to Swagger API)
  addPatient(patient: Omit<Patient, 'id'>) {
    this.http.post<Patient>(`${this.apiUrl}/Patients`, patient).pipe(
      tap(newPatient => {
        this.patients.update(list => [newPatient, ...list]);
      }),
      catchError(err => {
        console.error('API POST /Patients failed:', err);
        return of(null);
      })
    ).subscribe();
  }

  addAppointment(appointment: Omit<Appointment, 'id'>) {
    this.http.post<Appointment>(`${this.apiUrl}/Appointments/quick-book`, appointment).pipe(
      tap(newApt => {
        this.appointments.update(list => [newApt, ...list]);
      }),
      catchError(() => {
        return this.http.post<Appointment>(`${this.apiUrl}/Appointments`, appointment).pipe(
          tap(newApt => this.appointments.update(list => [newApt, ...list])),
          catchError(err => {
            console.error('API POST /Appointments failed:', err);
            return of(null);
          })
        );
      })
    ).subscribe();
  }

  addTreatment(treatment: Omit<Treatment, 'id'>) {
    this.http.post<Treatment>(`${this.apiUrl}/Treatments`, treatment).pipe(
      tap(newTreatment => {
        this.treatments.update(list => [newTreatment, ...list]);
      }),
      catchError(err => {
        console.error('API POST /Treatments failed:', err);
        return of(null);
      })
    ).subscribe();
  }

  addDevice(device: Omit<LaserDevice, 'id'>) {
    this.http.post<LaserDevice>(`${this.apiUrl}/Devices`, device).pipe(
      tap(newDevice => {
        this.devices.update(list => [newDevice, ...list]);
      }),
      catchError(err => {
        console.error('API POST /Devices failed:', err);
        return of(null);
      })
    ).subscribe();
  }

  addInvoice(invoice: Omit<Invoice, 'id'>) {
    this.http.post<Invoice>(`${this.apiUrl}/Invoices`, invoice).pipe(
      tap(newInv => {
        this.invoices.update(list => [newInv, ...list]);
      }),
      catchError(err => {
        console.error('API POST /Invoices failed:', err);
        return of(null);
      })
    ).subscribe();
  }

  addStaff(staffMember: Omit<StaffMember, 'id'>) {
    this.http.post<StaffMember>(`${this.apiUrl}/Staff`, staffMember).pipe(
      tap(newStaff => {
        this.staff.update(list => [newStaff, ...list]);
      }),
      catchError(err => {
        console.error('API POST /Staff failed:', err);
        return of(null);
      })
    ).subscribe();
  }

  getRevenueChart() {
    return this.http.get<DashboardRevenuePoint[]>(`${this.apiUrl}/Dashboard/revenue-chart`).pipe(
      tap(points => points && this.revenuePoints.set(points)),
      catchError(err => {
        console.error('Error fetching /api/Dashboard/revenue-chart:', err);
        return of([]);
      })
    );
  }

  getTreatmentCategories() {
    return this.http.get<DashboardCategoryPoint[]>(`${this.apiUrl}/Dashboard/treatment-categories`).pipe(
      tap(points => points && this.categoryPoints.set(points)),
      catchError(err => {
        console.error('Error fetching /api/Dashboard/treatment-categories:', err);
        return of([]);
      })
    );
  }

  loadUpcomingAppointments(count = 3) {
    this.http.get<DashboardAppointment[]>(`${this.apiUrl}/Dashboard/upcoming-appointments`, {
      params: { count }
    }).pipe(
      tap(data => Array.isArray(data) && this.upcomingAppointments.set(data.map(appointment => ({
        ...appointment,
        status: this.normalizeAppointmentStatus(appointment.status)
      })))),
      catchError(err => {
        console.error('Error fetching /api/Dashboard/upcoming-appointments:', err);
        return of(null);
      })
    ).subscribe();
  }

  private normalizeAppointmentStatus(status: string | number) {
    if (typeof status === 'string') return status;
    return ['Pending', 'Confirmed', 'Completed', 'Cancelled'][status] || 'Pending';
  }
}
