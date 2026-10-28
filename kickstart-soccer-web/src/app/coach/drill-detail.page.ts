import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ApiService, Drill } from '../services/api.service';
import { FieldDiagramComponent } from './field-diagram.component';

@Component({
  selector: 'app-drill-detail',
  templateUrl: './drill-detail.page.html',
  styleUrl: './drill-detail.page.scss',
  imports: [IonContent, RouterLink, FieldDiagramComponent],
})
export class DrillDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  readonly drill = signal<Drill | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  constructor() { this.loadDrill(); }

  loadDrill(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.api.getDrill(this.route.snapshot.paramMap.get('drillId') ?? '').subscribe({
      next: (drill) => { this.drill.set(drill); this.isLoading.set(false); },
      error: () => { this.errorMessage.set('Could not load this drill. Please try again.'); this.isLoading.set(false); },
    });
  }
}
