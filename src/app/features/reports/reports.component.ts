import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { ClinicDataService } from '../../core/services/clinic-data.service';
import { TransPipe } from '../../core/pipes/trans.pipe';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ChartModule, ButtonModule, TransPipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  readonly clinic = inject(ClinicDataService);

  barChartData: any;
  barChartOptions: any;

  get topTreatments() {
    const list = this.clinic.treatments();
    if (!list.length) return [];
    const colors = ['#8b4356', '#d4a373', '#e09f67', '#a37081', '#cf8ba9', '#dfc2b6'];
    const total = list.reduce((acc, t) => acc + (t.price || 0), 0) || 1;
    return list.slice(0, 6).map((t, idx) => ({
      name: t.name,
      percent: Math.round(((t.price || 0) / total) * 100) || 15,
      color: colors[idx % colors.length]
    }));
  }

  ngOnInit() {
    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#f5ebe8' } }
      }
    };

    this.clinic.getRevenueChart().subscribe(points => {
      const labels = points.map(point => point.month);
      const data = points.map(point => point.amount);
      this.barChartData = {
        labels,
        datasets: [
          {
            label: 'Monthly Revenue',
            data,
            backgroundColor: '#c48997',
            hoverBackgroundColor: '#8b4356',
            borderRadius: 6
          }
        ]
      };
    });
  }
}
