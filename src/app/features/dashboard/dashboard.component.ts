import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { ClinicDataService } from '../../core/services/clinic-data.service';
import { TransPipe } from '../../core/pipes/trans.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ChartModule, ButtonModule, TransPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  readonly clinic = inject(ClinicDataService);

  revenueData: any;
  revenueOptions: any;

  categoryData: any;
  categoryOptions: any;

  get categoryTotal() {
    return this.clinic.categoryPoints().reduce((total, category) => total + category.percentage, 0);
  }

  ngOnInit() {
    this.initRevenueChart();
    this.initCategoryChart();
  }

  private initRevenueChart() {
    this.revenueOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#a4979a', font: { size: 11 } } },
        y: { grid: { color: '#f3e8e9' }, ticks: { color: '#a4979a', font: { size: 11 } } }
      }
    };

    this.clinic.getRevenueChart().subscribe(points => {
      const labels = points.map(point => point.month);
      const data = points.map(point => point.amount);
      this.revenueData = {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data,
            fill: true,
            borderColor: '#8b4356',
            backgroundColor: 'rgba(139, 67, 86, 0.08)',
            tension: 0.45,
            pointBackgroundColor: '#8b4356',
            pointRadius: 3
          }
        ]
      };
    });
  }

  private initCategoryChart() {
    this.categoryOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: { legend: { display: false } }
    };

    this.clinic.getTreatmentCategories().subscribe(points => {
      const labels = points.map(point => point.categoryName);
      const data = points.map(point => point.percentage);
      this.categoryData = {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ['#8b4356', '#d4a373', '#e09f67', '#a37081', '#cf8ba9', '#dfc2b6'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      };
    });
  }
}
