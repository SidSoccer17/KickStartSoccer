import { LocalSeasonStorage } from './season-storage.service';

describe('LocalSeasonStorage', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('ignores malformed, invalid, and duplicate season records', () => {
    const storage = new LocalSeasonStorage();
    localStorage.setItem('kickstart-soccer.seasons', '{bad');
    expect(storage.loadSeasons()).toEqual([]);
    const valid = { id: 'season-1', term: 'spring', ageGroup: 'U6', weeks: 8, practiceDurationMinutes: 45, minPlayers: 6, maxPlayers: 12, sessions: [{ id: 'session-1', seasonId: 'season-1', weekNumber: 1, sessionNumber: 1, scheduledDate: null, practicePlanId: null }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    localStorage.setItem('kickstart-soccer.seasons', JSON.stringify([valid, valid, { ...valid, weeks: 9 }]));
    expect(storage.loadSeasons()).toEqual([valid]);
  });
});
