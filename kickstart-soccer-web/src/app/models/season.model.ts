export type SeasonTerm = 'spring' | 'fall';
export type SeasonAgeGroup = 'U6' | 'U7';
export type SeasonWeeks = 8 | 10;
export type PracticeDuration = 45 | 60;

export interface ScheduledSession {
  id: string;
  seasonId: string;
  weekNumber: number;
  sessionNumber: number;
  scheduledDate: string | null;
  practicePlanId: string | null;
}

export interface Season {
  id: string;
  term: SeasonTerm;
  ageGroup: SeasonAgeGroup;
  weeks: SeasonWeeks;
  practiceDurationMinutes: PracticeDuration;
  minPlayers: number;
  maxPlayers: number;
  sessions: ScheduledSession[];
  createdAt: string;
  updatedAt: string;
}

export interface NewSeason {
  term: SeasonTerm;
  ageGroup: SeasonAgeGroup;
  weeks: SeasonWeeks;
  practiceDurationMinutes: PracticeDuration;
  minPlayers: number;
  maxPlayers: number;
}

export function createId(prefix: string): string {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
