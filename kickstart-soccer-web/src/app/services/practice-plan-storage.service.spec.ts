import { LocalPracticePlanStorage } from './practice-plan-storage.service';

describe('LocalPracticePlanStorage', () => {
  let storage: LocalPracticePlanStorage;

  beforeEach(() => {
    localStorage.clear();
    storage = new LocalPracticePlanStorage();
  });

  afterEach(() => localStorage.clear());

  it('returns empty data for malformed or invalid stored JSON', () => {
    localStorage.setItem('kickstart-soccer.saved-practices', '{broken');
    localStorage.setItem('kickstart-soccer.current-practice-draft', JSON.stringify({ id: 'bad' }));

    expect(storage.loadSavedPractices()).toEqual([]);
    expect(storage.loadDraft()).toBeNull();
  });

  it('ignores invalid entries and duplicate saved-plan identifiers', () => {
    const valid = {
      id: 'practice-1',
      name: 'Valid plan',
      drills: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(
      'kickstart-soccer.saved-practices',
      JSON.stringify([valid, valid, { ...valid, drills: [{ id: 'invalid' }] }]),
    );

    expect(storage.loadSavedPractices()).toEqual([valid]);
  });

  it('persists both saved practices and the current draft for browser refresh', () => {
    const plan = {
      id: 'practice-1',
      name: 'After-school practice',
      drills: [
        {
          id: 'drill-1',
          title: 'Gate Passing',
          ageGroups: ['U6'],
          category: 'Passing',
          difficulty: 'Beginner',
          durationMinutes: 6,
          instructions: ['Pass through the gate.'],
          coachingTips: [],
          equipment: [],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const draft = { ...plan, name: 'Unsaved edit' };

    storage.saveSavedPractices([plan]);
    storage.saveDraft(draft);
    const refreshedStorage = new LocalPracticePlanStorage();

    expect(refreshedStorage.loadSavedPractices()).toEqual([plan]);
    expect(refreshedStorage.loadDraft()).toEqual(draft);
  });
});
