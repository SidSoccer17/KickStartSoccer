import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForward, flash, football, location, people, swapHorizontal, trophy, walk } from 'ionicons/icons';
import { ScheduledSession } from '../models/season.model';
import { PracticeSelectionService } from '../services/practice-selection.service';
import { SeasonPlanningService } from '../services/season-planning.service';

@Component({ selector: 'app-season-overview', templateUrl: './season-overview.page.html', styleUrl: './season-overview.page.scss', imports: [IonContent, IonIcon, RouterLink] })
export class SeasonOverviewPage {
  private readonly route = inject(ActivatedRoute);
  readonly planning = inject(SeasonPlanningService);
  readonly practices = inject(PracticeSelectionService);
  readonly season = computed(() => this.planning.findSeason(this.route.snapshot.paramMap.get('seasonId') ?? ''));
  private readonly draftSessions = signal<ScheduledSession[]>([]);
  readonly weeks = computed(() => this.draftSessions());
  readonly selectedSessionId = signal<string | null>(null);
  readonly selectedSession = computed(() =>
    this.weeks().find((session) => session.id === this.selectedSessionId()) ?? this.weeks()[0],
  );
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
    addIcons({
      football,
      walk,
      'swap-horizontal': swapHorizontal,
      location,
      'arrow-forward': arrowForward,
      people,
      flash,
      trophy,
    });
    this.syncDraft();
    this.selectedSessionId.set(
      this.draftSessions().find((session) => session.practicePlanId)?.id ?? this.draftSessions()[0]?.id ?? null,
    );
  }

  selectSession(sessionId: string): void {
    this.selectedSessionId.set(sessionId);
  }

  skillForWeek(weekNumber: number): string {
    const progression = [
      'Ball confidence', 'Dribbling', 'Stop & turn', 'Find space', 'Passing',
      'Pass & move', 'Team play', 'Game application', 'Pressure & decisions', 'Celebrate & reflect',
    ];
    return progression[(weekNumber - 1) % progression.length];
  }

  skillIconForWeek(weekNumber: number): string {
    const skill = this.skillForWeek(weekNumber).toLowerCase();
    if (skill.includes('ball') || skill.includes('confidence')) return 'football';
    if (skill.includes('dribbl') || skill.includes('move')) return 'walk';
    if (skill.includes('turn')) return 'swap-horizontal';
    if (skill.includes('space')) return 'location';
    if (skill.includes('pass')) return 'arrow-forward';
    if (skill.includes('team') || skill.includes('support')) return 'people';
    if (skill.includes('pressure') || skill.includes('decision')) return 'flash';
    if (skill.includes('celebrat') || skill.includes('reflect')) return 'trophy';
    return 'football';
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
