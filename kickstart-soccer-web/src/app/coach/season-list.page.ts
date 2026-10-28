import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { SeasonPlanningService } from '../services/season-planning.service';

@Component({
  selector: 'app-season-list',
  templateUrl: './season-list.page.html',
  styleUrl: './season-list.page.scss',
  imports: [DatePipe, IonContent, RouterLink],
})
export class SeasonListPage {
  readonly planning = inject(SeasonPlanningService);
  readonly scheduledSessions = computed(() =>
    this.planning.seasons()
      .flatMap((season) =>
        season.sessions
          .filter((session) => session.scheduledDate)
          .map((session) => ({ season, session })),
      )
      .sort((left, right) =>
        (left.session.scheduledDate ?? '').localeCompare(right.session.scheduledDate ?? ''),
      ),
  );
}
