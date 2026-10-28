import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, Drill } from '../services/api.service';
import { PracticeSelectionService } from '../services/practice-selection.service';

@Component({
  selector: 'app-drill-library',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonContent, RouterLink, ReactiveFormsModule],
})
export class Tab3Page {
  private readonly apiService = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  readonly practiceSelection = inject(PracticeSelectionService);
  readonly practiceName = new FormControl(this.practiceSelection.name(), { nonNullable: true });

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
  readonly practiceNameError = signal<string | null>(null);
  readonly practiceSaveMessage = signal<string | null>(null);

  constructor() {
    this.practiceName.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((name) => {
      this.practiceSelection.setName(name);
      this.practiceNameError.set(null);
      this.practiceSaveMessage.set(null);
    });
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
    if (this.practiceSelection.isSelected(drill.id)) {
      this.practiceSelection.remove(drill.id);
      this.selectionMessage.set(`${drill.title} removed from this practice.`);
    } else {
      this.practiceSelection.add(drill);
      this.selectionMessage.set(null);
    }
    this.practiceSaveMessage.set(null);
  }

  savePractice(): void {
    if (!this.practiceSelection.name().trim()) {
      this.practiceNameError.set('Enter a practice name before saving.');
      this.practiceSaveMessage.set(null);
      return;
    }

    if (this.practiceSelection.saveCurrent()) {
      this.practiceSelection.newPractice();
      this.practiceName.reset('');
      this.practiceNameError.set(null);
      this.practiceSaveMessage.set('Practice saved. Start another practice or create a season to assign it to a week.');
    } else {
      this.practiceSaveMessage.set(null);
    }
  }
}
