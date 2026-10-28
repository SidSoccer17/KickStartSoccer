import { TestBed } from '@angular/core/testing';
import { NewSeason, Season } from '../models/season.model';
import { SeasonPlanningService } from './season-planning.service';
import { SEASON_STORAGE, SeasonStorage } from './season-storage.service';

class MemorySeasonStorage extends SeasonStorage {
  seasons: Season[] = [];
  loadSeasons(): Season[] { return structuredClone(this.seasons); }
  saveSeasons(seasons: Season[]): void { this.seasons = structuredClone(seasons); }
}

const validSeason: NewSeason = { term: 'fall', ageGroup: 'U7', weeks: 8, practiceDurationMinutes: 60, minPlayers: 7, maxPlayers: 13 };

describe('SeasonPlanningService', () => {
  let storage: MemorySeasonStorage;
  let planning: SeasonPlanningService;

  beforeEach(() => {
    storage = new MemorySeasonStorage();
    TestBed.configureTestingModule({ providers: [SeasonPlanningService, { provide: SEASON_STORAGE, useValue: storage }] });
    planning = TestBed.inject(SeasonPlanningService);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('creates a season with one initially unassigned session for every week', () => {
    const season = planning.createSeason(validSeason);
    expect(season?.sessions).toHaveLength(8);
    expect(season?.sessions.every((session, index) => session.weekNumber === index + 1 && session.practicePlanId === null)).toBe(true);
    expect(planning.findSeason(season?.id ?? '')).toEqual(season);
  });

  it('assigns and unassigns a saved practice reference on a session', () => {
    const season = planning.createSeason(validSeason)!;
    const session = season.sessions[0];
    expect(planning.assignPractice(season.id, session.id, 'practice-1')).toBe(true);
    expect(planning.findSeason(season.id)?.sessions[0].practicePlanId).toBe('practice-1');
    expect(planning.assignPractice(season.id, session.id, null)).toBe(true);
    expect(planning.findSeason(season.id)?.sessions[0].practicePlanId).toBeNull();
    expect(planning.setScheduledDate(season.id, session.id, '2026-02-30')).toBe(false);
    expect(planning.setScheduledDate(season.id, session.id, '2026-10-21')).toBe(true);
    expect(planning.findSeason(season.id)?.sessions[0].scheduledDate).toBe('2026-10-21');
    expect(planning.assignPractice(season.id, 'missing-session', 'practice-1')).toBe(false);
  });

  it('updates scheduled sessions together and rejects incomplete or invalid updates', () => {
    const season = planning.createSeason(validSeason)!;
    const updates = season.sessions.map((session, index) => index === 0
      ? { ...session, practicePlanId: 'practice-1', scheduledDate: '2026-10-22' }
      : session);

    expect(planning.updateSessions(season.id, updates)).toBe(true);
    expect(planning.findSeason(season.id)?.sessions[0]).toMatchObject({
      practicePlanId: 'practice-1',
      scheduledDate: '2026-10-22',
    });
    expect(planning.updateSessions(season.id, updates.slice(1))).toBe(false);
    expect(planning.updateSessions(season.id, updates.map((session, index) => index === 0
      ? { ...session, scheduledDate: '2026-02-30' }
      : session))).toBe(false);
  });

  it('rejects invalid player ranges and unsupported configuration values', () => {
    expect(planning.createSeason({ ...validSeason, minPlayers: 0 })).toBeNull();
    expect(planning.createSeason({ ...validSeason, minPlayers: 12, maxPlayers: 11 })).toBeNull();
    expect(planning.createSeason({ ...validSeason, weeks: 9 as NewSeason['weeks'] })).toBeNull();
    expect(planning.seasons()).toEqual([]);
  });
});
