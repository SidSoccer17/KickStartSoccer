import { TestBed } from '@angular/core/testing';
import { Drill } from './api.service';
import { createPracticePlan } from '../models/practice-plan.model';
import { PracticePlan } from '../models/practice-plan.model';
import { PracticeSelectionService } from './practice-selection.service';
import { PRACTICE_PLAN_STORAGE, PracticePlanStorage } from './practice-plan-storage.service';

const makeDrill = (id: string, durationMinutes: number): Drill => ({
  id,
  title: `Drill ${id}`,
  ageGroups: ['U6'],
  category: 'Passing',
  difficulty: 'Beginner',
  durationMinutes,
  instructions: ['Pass the ball.'],
  coachingTips: [],
  equipment: [],
});

class MemoryPracticePlanStorage extends PracticePlanStorage {
  saved: PracticePlan[] = [];
  draft: PracticePlan | null = null;

  loadSavedPractices(): PracticePlan[] {
    return structuredClone(this.saved);
  }

  loadDraft(): PracticePlan | null {
    return this.draft ? structuredClone(this.draft) : null;
  }

  saveSavedPractices(practices: PracticePlan[]): void {
    this.saved = structuredClone(practices);
  }

  saveDraft(draft: PracticePlan): void {
    this.draft = structuredClone(draft);
  }
}

describe('PracticeSelectionService', () => {
  let storage: MemoryPracticePlanStorage;
  let selection: PracticeSelectionService;

  beforeEach(() => {
    storage = new MemoryPracticePlanStorage();
    configureService();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('prevents duplicate drill IDs in the current practice', () => {
    const drill = makeDrill('one', 6);

    expect(selection.add(drill)).toBe(true);
    expect(selection.add({ ...drill, title: 'Duplicate' })).toBe(false);
    expect(selection.drills()).toEqual([drill]);
  });

  it('requires a nonblank name and keeps ordered selections with derived totals', () => {
    selection.add(makeDrill('one', 6));
    selection.add(makeDrill('two', 5));
    selection.move('two', -1);
    selection.setName('   ');

    expect(selection.saveCurrent()).toBe(false);
    expect(selection.selectionCount()).toBe(2);
    expect(selection.totalDurationMinutes()).toBe(11);
    expect(selection.drills().map((drill) => drill.id)).toEqual(['two', 'one']);

    selection.setName('  Tuesday practice  ');
    expect(selection.saveCurrent()).toBe(true);
    expect(selection.savedPractices()).toHaveLength(1);
    expect(selection.savedPractices()[0].name).toBe('Tuesday practice');
    expect(selection.savedPractices()[0].drills.map((drill) => drill.id)).toEqual(['two', 'one']);
  });

  it('updates an existing saved practice instead of creating a duplicate', () => {
    selection.setName('First practice');
    expect(selection.saveCurrent()).toBe(true);
    const savedId = selection.draft().id;

    selection.setName('Updated practice');
    selection.add(makeDrill('one', 8));
    expect(selection.saveCurrent()).toBe(true);

    expect(selection.savedPractices()).toHaveLength(1);
    expect(selection.savedPractices()[0].id).toBe(savedId);
    expect(selection.savedPractices()[0].name).toBe('Updated practice');
  });

  it('restores the current draft and saved practice after service recreation', () => {
    selection.setName('Practice to reopen');
    selection.add(makeDrill('one', 6));
    selection.add(makeDrill('two', 5));
    selection.move('two', -1);
    selection.saveCurrent();
    selection.setName('Unsaved revised name');

    TestBed.resetTestingModule();
    configureService();
    const refreshed = TestBed.inject(PracticeSelectionService);
    expect(refreshed.savedPractices()).toHaveLength(1);
    expect(refreshed.name()).toBe('Unsaved revised name');
    expect(refreshed.drills().map((drill) => drill.id)).toEqual(['two', 'one']);
    expect(refreshed.isDirty()).toBe(true);

    expect(refreshed.openPractice(refreshed.savedPractices()[0].id)).toBe(true);
    expect(refreshed.name()).toBe('Practice to reopen');
    expect(refreshed.isDirty()).toBe(false);
  });

  it('supports removing and clearing selections without deleting saved practices', () => {
    selection.setName('Saved plan');
    selection.add(makeDrill('one', 6));
    selection.saveCurrent();

    selection.remove('one');
    expect(selection.drills()).toEqual([]);
    expect(selection.totalDurationMinutes()).toBe(0);
    selection.clear();
    expect(selection.savedPractices()).toHaveLength(1);
  });

  it('creates a valid new plan model with timestamps and an identifier', () => {
    const plan = createPracticePlan();
    expect(plan.id).toBeTruthy();
    expect(plan.name).toBe('');
    expect(Date.parse(plan.createdAt)).not.toBeNaN();
    expect(Date.parse(plan.updatedAt)).not.toBeNaN();
  });

  function configureService(): void {
    TestBed.configureTestingModule({
      providers: [
        PracticeSelectionService,
        { provide: PRACTICE_PLAN_STORAGE, useValue: storage },
      ],
    });
    selection = TestBed.inject(PracticeSelectionService);
  }
});
