import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, vi } from 'vitest';

import { PracticeSelectionService } from '../services/practice-selection.service';
import { Drill } from '../services/api.service';
import { Tab2Page } from './tab2.page';

const makeDrill = (id: string, title: string, durationMinutes: number): Drill => ({
  id,
  title,
  ageGroups: ['U6'],
  category: 'Dribbling',
  difficulty: 'Beginner',
  durationMinutes,
  instructions: ['Start the drill.'],
  coachingTips: [],
  equipment: [],
});

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  let selection: PracticeSelectionService;

  afterEach(() => vi.restoreAllMocks());

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Tab2Page],
      providers: [provideRouter([])],
    }).compileComponents();

    selection = TestBed.inject(PracticeSelectionService);
    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and show an empty state', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Your practice plan is empty');
    expect(fixture.nativeElement.textContent).toContain('Browse drills');
    expect(fixture.nativeElement.textContent).toContain('No saved practices yet');
    expect(fixture.nativeElement.querySelector('.empty-icon svg')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('?');
  });

  it('shows selected drills and their combined duration', () => {
    selection.add(makeDrill('one', 'Gate Passing', 6));
    selection.add(makeDrill('two', 'Red Light, Green Light', 5));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Gate Passing');
    expect(fixture.nativeElement.textContent).toContain('11');
    expect(fixture.nativeElement.textContent).toContain('Dribbling · 6 min · Beginner');
    expect(fixture.nativeElement.textContent).not.toContain('?');
    const summary = fixture.nativeElement.querySelector('.plan-summary') as HTMLElement;
    expect(summary.textContent).toContain('2');
    expect(summary.textContent).toContain('drills selected');
    expect(fixture.nativeElement.querySelectorAll('.order-actions svg')).toHaveLength(4);
    expect(fixture.nativeElement.querySelector('[aria-label="Move Gate Passing up"]')).toHaveProperty('disabled', true);
    expect(fixture.nativeElement.querySelector('[aria-label="Move Red Light, Green Light down"]')).toHaveProperty('disabled', true);
  });

  it('reorders drills using the arrow controls and removes them', () => {
    selection.add(makeDrill('one', 'Gate Passing', 6));
    selection.add(makeDrill('two', 'Red Light, Green Light', 5));
    fixture.detectChanges();

    const moveUpButton = fixture.nativeElement.querySelector(
      '[aria-label="Move Red Light, Green Light up"]',
    ) as HTMLButtonElement;
    moveUpButton.click();

    expect(selection.drills().map((drill) => drill.id)).toEqual(['two', 'one']);
    fixture.detectChanges();
    component.removeDrill('two');
    expect(selection.drills().map((drill) => drill.id)).toEqual(['one']);
  });

  it('validates a practice name and saves the current plan', () => {
    fixture.nativeElement.querySelector('.save-button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Enter a practice name before saving.');
    const nameInput = fixture.nativeElement.querySelector('#practice-name') as HTMLInputElement;
    nameInput.value = 'Weeknight practice';
    nameInput.dispatchEvent(new Event('input'));
    selection.add(makeDrill('one', 'Gate Passing', 6));
    component.savePractice();

    expect(selection.savedPractices()).toHaveLength(1);
    expect(selection.savedPractices()[0].name).toBe('Weeknight practice');
  });

  it('confirms clearing the current selection without deleting saved practices', () => {
    selection.setName('Saved practice');
    selection.add(makeDrill('one', 'Gate Passing', 6));
    expect(selection.saveCurrent()).toBe(true);
    selection.setName('Unsaved edit');
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.clearCurrentSelection();

    expect(selection.drills()).toEqual([]);
    expect(selection.savedPractices()).toHaveLength(1);
  });

  it('lists, opens, and deletes saved practices with confirmation', () => {
    selection.setName('Saved practice');
    selection.add(makeDrill('one', 'Gate Passing', 6));
    selection.saveCurrent();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Saved practices');
    expect(fixture.nativeElement.textContent).toContain('Saved practice');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.startNewPractice();
    component.openPractice(selection.savedPractices()[0].id);
    expect(selection.name()).toBe('Saved practice');

    component.deletePractice(selection.savedPractices()[0].id);
    expect(selection.savedPractices()).toHaveLength(0);
  });

  it('keeps a modified draft when replacement is declined', () => {
    selection.setName('Saved practice');
    expect(selection.saveCurrent()).toBe(true);
    selection.newPractice();
    selection.setName('Unsaved practice');
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.openPractice(selection.savedPractices()[0].id);
    component.startNewPractice();

    expect(selection.name()).toBe('Unsaved practice');
    expect(selection.isDirty()).toBe(true);
  });
});
