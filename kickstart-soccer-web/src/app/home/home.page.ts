import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { PracticeSelectionService } from '../services/practice-selection.service';
import { SeasonPlanningService } from '../services/season-planning.service';
import { ApiService } from '../services/api.service';
import { UserRoleService } from '../services/user-role.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  imports: [IonContent, RouterLink],
})
export class HomePage {
  readonly roles = inject(UserRoleService);
  readonly planning = inject(SeasonPlanningService);
  readonly practices = inject(PracticeSelectionService);
  private readonly api = inject(ApiService);
  readonly roleLabel = computed(() => {
    switch (this.roles.selectedRole()) {
      case 'parent':
        return 'Parent';
      case 'player':
        return 'Player';
      default:
        return 'Coach';
    }
  });
  readonly roleDescription = computed(() => {
    switch (this.roles.selectedRole()) {
      case 'parent':
        return 'Find soccer activities to explore and practice with your player.';
      case 'player':
        return 'Explore soccer drills and learn how to play, one activity at a time.';
      default:
        return '';
    }
  });
  readonly roleNotice = computed(() => {
    switch (this.roles.selectedRole()) {
      case 'parent':
        return 'Family accounts, player connections, assigned activities, and progress are not available yet.';
      case 'player':
        return 'Player sign-in, assigned training, and progress tracking are not available yet.';
      default:
        return '';
    }
  });
  readonly drillCount = signal<number | null>(null);
  readonly isLoadingDrills = signal(false);
  readonly drillLoadError = signal<string | null>(null);

  constructor() {
    if (this.roles.isCoach()) {
      this.loadDrillCount();
    }
  }

  private loadDrillCount(): void {
    this.isLoadingDrills.set(true);
    this.drillLoadError.set(null);
    this.api.getDrills().subscribe({
      next: (drills) => {
        this.drillCount.set(drills.length);
        this.isLoadingDrills.set(false);
      },
      error: () => {
        this.drillLoadError.set('Drill counts are unavailable right now. Open the library to retry.');
        this.isLoadingDrills.set(false);
      },
    });
  }
}
