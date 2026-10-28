import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { PracticeSelectionService } from '../services/practice-selection.service';
import { SeasonPlanningService } from '../services/season-planning.service';
import { SeasonOverviewPage } from './season-overview.page';

const season = { id: 'season-1', term: 'spring' as const, ageGroup: 'U6' as const, weeks: 8 as const, practiceDurationMinutes: 45 as const, minPlayers: 6, maxPlayers: 12, sessions: Array.from({ length: 8 }, (_, index) => ({ id: `session-${index + 1}`, seasonId: 'season-1', weekNumber: index + 1, sessionNumber: 1, scheduledDate: null, practicePlanId: null })), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
const practice = { id: 'practice-1', name: 'Passing practice', drills: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

describe('SeasonOverviewPage', () => {
  let fixture: ComponentFixture<SeasonOverviewPage>;
  const route = { snapshot: { paramMap: { get: () => 'season-1' } } };

  beforeEach(async () => {
    localStorage.setItem('kickstart-soccer.seasons', JSON.stringify([season]));
    localStorage.setItem('kickstart-soccer.saved-practices', JSON.stringify([practice]));
    await TestBed.configureTestingModule({ imports: [SeasonOverviewPage], providers: [provideRouter([]), { provide: ActivatedRoute, useValue: route }] }).compileComponents();
    fixture = TestBed.createComponent(SeasonOverviewPage);
    fixture.detectChanges();
  });

  afterEach(() => { localStorage.clear(); TestBed.resetTestingModule(); });

  it('requires saving season changes after assigning or unassigning a practice', () => {
    expect(fixture.nativeElement.querySelectorAll('.week-card')).toHaveLength(8);
    const planning = TestBed.inject(SeasonPlanningService);
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    const saveButton = fixture.nativeElement.querySelector('.season-save button') as HTMLButtonElement;
    expect(saveButton.disabled).toBe(false);

    select.value = 'practice-1';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Passing practice');
    expect(fixture.nativeElement.textContent).toContain('unsaved changes');
    expect(planning.findSeason('season-1')?.sessions[0].practicePlanId).toBeNull();
    expect(saveButton.disabled).toBe(false);

    saveButton.click();
    fixture.detectChanges();
    expect(planning.findSeason('season-1')?.sessions[0].practicePlanId).toBe('practice-1');
    expect(fixture.nativeElement.textContent).toContain('Season updates saved.');
    expect(saveButton.disabled).toBe(false);

    select.value = '';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No practice assigned');
    saveButton.click();
    fixture.detectChanges();
    expect(planning.findSeason('season-1')?.sessions[0].practicePlanId).toBeNull();
    expect(TestBed.inject(PracticeSelectionService).savedPractices()).toHaveLength(1);
  });
});
