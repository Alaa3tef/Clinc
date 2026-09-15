export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
  isVip?: boolean;
  avatar?: string;
  age?: number;
  gender?: 'Female' | 'Male';
  address?: string;
  medicalHistory?: string[];
  totalVisits?: number;
}

export interface Appointment {
  id: string;
  patientId?: string;
  patientName: string;
  treatment: string;
  staffName?: string;
  date: string;
  time: string;
  duration?: string;
  room: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  price?: number;
}

export interface Treatment {
  id: string;
  name: string;
  nameAr?: string;
  category: 'Laser' | 'Skin' | 'Injectables' | 'Body' | 'Other';
  durationMinutes: number;
  price: number;
  status: 'Active' | 'Inactive';
  description?: string;
}

export interface LaserDevice {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  room: string;
  maintenanceStatus: string;
  isMaintenanceDue?: boolean;
  dueDays?: number;
  lastMaintenance?: string;
}

export interface LaserSession {
  id: string;
  patientId: string;
  patientName: string;
  patientPhoto?: string;
  treatmentName: string;
  sessionNumber: number;
  totalSessions: number;
  date: string;
  time: string;
  area: string;
  deviceName: string;
  technicianName: string;
  room: string;
  durationMinutes: number;
  parameters: {
    energy: string;         // e.g. "18 J/cm²"
    pulseDuration: string;  // e.g. "20 ms"
    frequency: string;      // e.g. "10 Hz"
    spotSize: string;       // e.g. "12 mm"
    coolingLevel: string;   // e.g. "Level 3"
    skinType: string;       // e.g. "Fitzpatrick III"
  };
  beforeImage?: string;
  afterImage?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  patientName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Partial' | 'Refunded';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Doctor' | 'Technician' | 'Nurse' | 'Receptionist' | 'Admin';
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
}

export interface DashboardKPIs {
  totalPatients: number;
  patientsGrowth: string;
  todayAppointments: number;
  appointmentsDiff: string;
  todayRevenue: number;
  revenueGrowth: string;
  pendingPayments: number;
  pendingDiff: string;
}

export interface DashboardRevenuePoint {
  month: string;
  amount: number;
}

export interface DashboardCategoryPoint {
  categoryName: string;
  percentage: number;
}

export interface DashboardAppointment {
  id: string;
  patientName: string;
  treatmentName: string;
  staffName?: string;
  scheduledAt: string;
  room: string;
  status: string;
}
