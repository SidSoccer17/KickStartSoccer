import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ScheduledSession } from '../models/season.model';
import { PracticeSelectionService } from '../services/practice-selection.service';
import { SeasonPlanningService } from '../services/season-planning.service';

@Component({ selector: 'app-season-overview', templateUrl: './season-overview.page.html', styleUrl: './season-overview.page.scss', imports: [IonContent, RouterLink] })
export class SeasonOverviewPage {
  private readonly route = inject(ActivatedRoute);
  readonly planning = inject(SeasonPlanningService);
  readonly practices = inject(PracticeSelectionService);
  readonly season = computed(() => this.planning.findSeason(this.route.snapshot.paramMap.get('seasonId') ?? ''));
  private readonly draftSessions = signal<ScheduledSession[]>([]);
  readonly weeks = computed(() => this.draftSessions());
  readonly hasUnsavedChanges = computed(() => {
    const saved = this.season()?.sessions;
    const draft = this.draftSessions();
    return !!saved && (saved.length !== draft.length || saved.some((session, index) =>
      session.id !== draft[index]?.id ||
      session.scheduledDate !== draft[index]?.scheduledDate ||
      session.practicePlanId !== draft[index]?.practicePlanId,
    ));
  });
  readonly saveMessage = signal<string | null>(null);

  constructor() {
    this.syncDraft();
  }

  setScheduledDate(sessionId: string, event: Event): void {
    const date = (event.target as HTMLInputElement).value || null;
    this.updateDraft(sessionId, (session) => ({ ...session, scheduledDate: date }));
  }

  assignPractice(sessionId: string, event: Event): void {
    const practiceId = (event.target as HTMLSelectElement).value || null;
    if (practiceId && !this.practices.savedPractices().some((practice) => practice.id === practiceId)) return;
    this.updateDraft(sessionId, (session) => ({ ...session, practicePlanId: practiceId }));
  }

  saveSeason(): void {
    const current = this.season();
    if (!current) return;
    if (this.planning.updateSessions(current.id, this.draftSessions())) {
      this.saveMessage.set('Season updates saved.');
    } else {
      this.saveMessage.set(null);
    }
  }

  assignedPractice(practiceId: string | null) {
    return practiceId ? this.practices.savedPractices().find((practice) => practice.id === practiceId) : undefined;
  }

  private updateDraft(sessionId: string, update: (session: ScheduledSession) => ScheduledSession): void {
    this.saveMessage.set(null);
    this.draftSessions.update((sessions) =>
      sessions.map((session) => session.id === sessionId ? update(session) : session),
    );
  }

  private syncDraft(): void {
    this.draftSessions.set(this.season()?.sessions.map((session) => ({ ...session })) ?? []);
  }
}
