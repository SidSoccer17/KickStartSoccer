import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ApiService, Drill } from '../services/api.service';
import { PracticeSelectionService } from '../services/practice-selection.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonContent, RouterLink],
})
export class Tab3Page {
  private readonly apiService = inject(ApiService);
  readonly practiceSelection = inject(PracticeSelectionService);

  readonly drills = signal<Drill[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly selectionMessage = signal<string | null>(null);
  readonly selectionCount = computed(() => this.practiceSelection.drills().length);

  constructor() {
    this.loadDrills();
  }

  loadDrills(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.apiService.getDrills().subscribe({
      next: (drills) => {
        this.drills.set(drills);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load drills. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  addToPractice(drill: Drill): void {
    const added = this.practiceSelection.add(drill);
    this.selectionMessage.set(added ? null : `${drill.title} is already selected for this practice.`);
  }
}
