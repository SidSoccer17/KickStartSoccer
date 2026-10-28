import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { NewSeason, SeasonAgeGroup, SeasonTerm } from '../models/season.model';
import { PracticeSelectionService } from '../services/practice-selection.service';
import { SeasonPlanningService } from '../services/season-planning.service';

@Component({ selector: 'app-create-season', templateUrl: './create-season.page.html', styleUrl: './create-season.page.scss', imports: [IonContent, RouterLink] })
export class CreateSeasonPage {
  private readonly router = inject(Router);
  readonly planning = inject(SeasonPlanningService);
  readonly practices = inject(PracticeSelectionService);
  readonly term = signal<SeasonTerm>('spring');
  readonly ageGroup = signal<SeasonAgeGroup>('U6');
  readonly weeks = signal('8');
  readonly duration = signal('45');
  readonly minPlayers = signal('8');
  readonly maxPlayers = signal('14');
  readonly errorMessage = signal<string | null>(null);
  updateTerm(event: Event): void { this.term.set((event.target as HTMLSelectElement).value as SeasonTerm); }
  updateAgeGroup(event: Event): void { this.ageGroup.set((event.target as HTMLSelectElement).value as SeasonAgeGroup); }
  updateWeeks(event: Event): void { this.weeks.set((event.target as HTMLSelectElement).value); }
  updateDuration(event: Event): void { this.duration.set((event.target as HTMLSelectElement).value); }
  updateMinPlayers(event: Event): void { this.minPlayers.set((event.target as HTMLInputElement).value); }
  updateMaxPlayers(event: Event): void { this.maxPlayers.set((event.target as HTMLInputElement).value); }
  createSeason(): void {
    const minPlayers = Number(this.minPlayers());
    const maxPlayers = Number(this.maxPlayers());
    if (!Number.isInteger(minPlayers) || minPlayers < 1 || !Number.isInteger(maxPlayers) || maxPlayers < minPlayers) {
      this.errorMessage.set('Enter a valid player range with a minimum of at least one and a maximum no lower than the minimum.');
      return;
    }
    const season = this.planning.createSeason({ term: this.term(), ageGroup: this.ageGroup(), weeks: Number(this.weeks()) as NewSeason['weeks'], practiceDurationMinutes: Number(this.duration()) as NewSeason['practiceDurationMinutes'], minPlayers, maxPlayers });
    if (!season) { this.errorMessage.set(this.planning.persistenceError() ?? 'Season details are invalid.'); return; }
    this.errorMessage.set(null);
    void this.router.navigate(['/coach/seasons', season.id]);
  }
}
