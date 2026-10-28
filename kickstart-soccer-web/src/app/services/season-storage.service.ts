import { inject, Injectable, InjectionToken } from '@angular/core';
import { Season } from '../models/season.model';

export abstract class SeasonStorage {
  abstract loadSeasons(): Season[];
  abstract saveSeasons(seasons: Season[]): void;
}

const SEASONS_KEY = 'kickstart-soccer.seasons';

@Injectable({ providedIn: 'root' })
export class LocalSeasonStorage extends SeasonStorage {
  loadSeasons(): Season[] {
    let parsed: unknown;
    try {
      const raw = globalThis.localStorage?.getItem(SEASONS_KEY);
      parsed = raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
    if (!Array.isArray(parsed)) return [];
    const seasons = parsed.filter(isSeason);
    return seasons.filter((season, index) => seasons.findIndex((item) => item.id === season.id) === index);
  }

  saveSeasons(seasons: Season[]): void {
    globalThis.localStorage.setItem(SEASONS_KEY, JSON.stringify(seasons));
  }
}

export const SEASON_STORAGE = new InjectionToken<SeasonStorage>('SEASON_STORAGE', {
  providedIn: 'root',
  factory: () => inject(LocalSeasonStorage),
});

function isSeason(value: unknown): value is Season {
  if (!value || typeof value !== 'object') return false;
  const season = value as Partial<Season>;
  return typeof season.id === 'string' && season.id.length > 0 &&
    (season.term === 'spring' || season.term === 'fall') &&
    (season.ageGroup === 'U6' || season.ageGroup === 'U7') &&
    (season.weeks === 8 || season.weeks === 10) &&
    (season.practiceDurationMinutes === 45 || season.practiceDurationMinutes === 60) &&
    Number.isInteger(season.minPlayers) && Number(season.minPlayers) > 0 &&
    Number.isInteger(season.maxPlayers) && Number(season.maxPlayers) >= Number(season.minPlayers) &&
    Array.isArray(season.sessions) && season.sessions.every((session) =>
      !!session && typeof session.id === 'string' && session.seasonId === season.id &&
      Number.isInteger(session.weekNumber) && Number(session.weekNumber) >= 1 && Number(session.weekNumber) <= Number(season.weeks) &&
      Number.isInteger(session.sessionNumber) && Number(session.sessionNumber) >= 1 &&
      (session.scheduledDate === null || typeof session.scheduledDate === 'string') &&
      (session.practicePlanId === null || typeof session.practicePlanId === 'string')) &&
    typeof season.createdAt === 'string' && !Number.isNaN(Date.parse(season.createdAt)) &&
    typeof season.updatedAt === 'string' && !Number.isNaN(Date.parse(season.updatedAt));
}
