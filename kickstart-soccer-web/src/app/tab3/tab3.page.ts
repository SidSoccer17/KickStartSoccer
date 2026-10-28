import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ApiService, Drill } from '../services/api.service';
import { PracticeSelectionService } from '../services/practice-selection.service';
import { SeasonPlanningService } from '../services/season-planning.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonContent, RouterLink],
})
export class Tab3Page {
  private readonly apiService = inject(ApiService);
  readonly practiceSelection = inject(PracticeSelectionService);
  readonly seasonPlanning = inject(SeasonPlanningService);

  readonly drills = signal<Drill[]>([]);
  readonly selectedAge = signal('');
  readonly selectedCategory = signal('');
  readonly searchTerm = signal('');
  readonly categories = [
    'Ball Mastery and Warm-ups',
    'Dribbling and Turning',
    'Ball Protection and 1v1',
    'Shooting and Finishing',
    'Passing and Awareness',
    'Small-Sided Games',
  ];
  readonly filteredDrills = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    if (!query) return this.drills();
    return this.drills().filter((drill) =>
      [drill.title, drill.curriculumId, drill.category, drill.primarySkill, ...(drill.secondarySkills ?? [])]
        .some((value) => value?.toLowerCase().includes(query)),
    );
  });
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

    this.apiService.getDrills({ age: this.selectedAge(), category: this.selectedCategory() }).subscribe({
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

  updateAge(event: Event): void {
    this.selectedAge.set((event.target as HTMLSelectElement).value);
    this.loadDrills();
  }

  updateCategory(event: Event): void {
    this.selectedCategory.set((event.target as HTMLSelectElement).value);
    this.loadDrills();
  }

  updateSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  addToPractice(drill: Drill): void {
    const added = this.practiceSelection.add(drill);
    this.selectionMessage.set(added ? null : `${drill.title} is already selected for this practice.`);
  }
}
