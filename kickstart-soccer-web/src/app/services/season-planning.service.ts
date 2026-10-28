import { computed, inject, Injectable, signal } from '@angular/core';
import { NewSeason, Season, ScheduledSession, createId } from '../models/season.model';
import { SEASON_STORAGE } from './season-storage.service';

@Injectable({ providedIn: 'root' })
export class SeasonPlanningService {
  private readonly storage = inject(SEASON_STORAGE);
  readonly seasons = signal<Season[]>([]);
  readonly persistenceError = signal<string | null>(null);
  readonly seasonCount = computed(() => this.seasons().length);

  constructor() {
    try {
      this.seasons.set(this.storage.loadSeasons());
    } catch {
      this.persistenceError.set('Local season data could not be loaded.');
    }
  }

  createSeason(input: NewSeason): Season | null {
    if (!this.isValid(input)) return null;
    const id = createId('season');
    const now = new Date().toISOString();
    const sessions: ScheduledSession[] = Array.from({ length: input.weeks }, (_, index) => ({
      id: createId('session'),
      seasonId: id,
      weekNumber: index + 1,
      sessionNumber: 1,
      scheduledDate: null,
      practicePlanId: null,
    }));
    const season: Season = { ...input, id, sessions, createdAt: now, updatedAt: now };
    return this.persist([...this.seasons(), season]) ? season : null;
  }

  findSeason(seasonId: string): Season | undefined {
    return this.seasons().find((season) => season.id === seasonId);
  }

  assignPractice(seasonId: string, sessionId: string, practicePlanId: string | null): boolean {
    const current = this.findSeason(seasonId);
    if (!current || !current.sessions.some((session) => session.id === sessionId)) return false;
    const updated: Season = {
      ...current,
      sessions: current.sessions.map((session) => session.id === sessionId ? { ...session, practicePlanId } : session),
      updatedAt: new Date().toISOString(),
    };
    return this.persist(this.seasons().map((season) => season.id === seasonId ? updated : season));
  }

  updateSessions(seasonId: string, sessionUpdates: ScheduledSession[]): boolean {
    const current = this.findSeason(seasonId);
    if (!current || !areValidSessionUpdates(current.sessions, sessionUpdates)) return false;
    const updatesById = new Map(sessionUpdates.map((session) => [session.id, session]));
    const updated: Season = {
      ...current,
      sessions: current.sessions.map((session) => {
        const update = updatesById.get(session.id)!;
        return { ...session, scheduledDate: update.scheduledDate, practicePlanId: update.practicePlanId };
      }),
      updatedAt: new Date().toISOString(),
    };
    return this.persist(this.seasons().map((season) => season.id === seasonId ? updated : season));
  }

  setScheduledDate(seasonId: string, sessionId: string, scheduledDate: string | null): boolean {
    if (scheduledDate && !isValidDateOnly(scheduledDate)) return false;
    const current = this.findSeason(seasonId);
    if (!current || !current.sessions.some((session) => session.id === sessionId)) return false;
    const updated: Season = {
      ...current,
      sessions: current.sessions.map((session) => session.id === sessionId ? { ...session, scheduledDate } : session),
      updatedAt: new Date().toISOString(),
    };
    return this.persist(this.seasons().map((season) => season.id === seasonId ? updated : season));
  }

  private persist(seasons: Season[]): boolean {
    try {
      this.storage.saveSeasons(seasons);
      this.seasons.set(seasons);
      this.persistenceError.set(null);
      return true;
    } catch {
      this.persistenceError.set('Season changes could not be saved on this device.');
      return false;
    }
  }

  private isValid(input: NewSeason): boolean {
    return (input.term === 'spring' || input.term === 'fall') &&
      (input.ageGroup === 'U6' || input.ageGroup === 'U7') &&
      (input.weeks === 8 || input.weeks === 10) &&
      (input.practiceDurationMinutes === 45 || input.practiceDurationMinutes === 60) &&
      Number.isInteger(input.minPlayers) && input.minPlayers > 0 &&
      Number.isInteger(input.maxPlayers) && input.maxPlayers >= input.minPlayers;
  }
}

function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function areValidSessionUpdates(current: ScheduledSession[], updates: ScheduledSession[]): boolean {
  if (updates.length !== current.length) return false;
  const currentIds = new Set(current.map((session) => session.id));
  const updateIds = new Set(updates.map((session) => session.id));
  return updateIds.size === updates.length &&
    updates.every((session) =>
      currentIds.has(session.id) &&
      (!session.scheduledDate || isValidDateOnly(session.scheduledDate)) &&
      (session.practicePlanId === null || typeof session.practicePlanId === 'string'));
}
