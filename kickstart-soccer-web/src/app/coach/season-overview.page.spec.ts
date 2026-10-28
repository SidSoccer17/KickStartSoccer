import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { PracticeSelectionService } from '../services/practice-selection.service';
import { Drill } from '../services/api.service';
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
    expect(fixture.nativeElement.querySelectorAll('.journey-station')).toHaveLength(8);
    expect(fixture.nativeElement.querySelectorAll('.week-card')).toHaveLength(1);
    const skillIcons = fixture.nativeElement.querySelectorAll('.station-skill-icon') as NodeListOf<HTMLElement>;
    expect(Array.from(skillIcons).map((icon) => icon.getAttribute('name'))).toEqual([
      'football', 'walk', 'swap-horizontal', 'location', 'arrow-forward', 'walk', 'people', 'football',
    ]);
    expect(skillIcons[3].classList).toContain('station-skill-icon--orange');
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

  it('keeps the planned week skill label when an assigned drill has a different primary skill', () => {
    const practiceSelection = TestBed.inject(PracticeSelectionService);
    const drill: Drill = {
      id: 'dribbling-drill', title: 'Dribble Gates', ageGroups: ['U6'], category: 'Dribbling',
      difficulty: 'Beginner', durationMinutes: 6, instructions: [], coachingTips: [], equipment: [],
      primarySkill: 'Dribbling',
    };
    practiceSelection.setName('Dribbling practice');
    practiceSelection.add(drill);
    expect(practiceSelection.saveCurrent()).toBe(true);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = practiceSelection.savedPractices()[1].id;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.journey-station .station-skill').textContent).toContain('Ball confidence');
    expect(fixture.nativeElement.querySelector('.station-skill-icon').getAttribute('name')).toBe('football');
    expect(fixture.nativeElement.querySelector('.week-heading h2').textContent).toContain('Ball confidence');
  });

  it('updates the selected practice details when a journey week is selected', () => {
    const stations = fixture.nativeElement.querySelectorAll('.journey-station') as NodeListOf<HTMLButtonElement>;
    stations[1].click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.week-heading').textContent).toContain('WEEK 2');
    expect(fixture.nativeElement.querySelector('.week-meta').textContent).toContain('Practice 1');
  });
});
