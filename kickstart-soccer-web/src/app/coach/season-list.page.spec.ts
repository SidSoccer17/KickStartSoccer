import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SeasonListPage } from './season-list.page';

describe('SeasonListPage', () => {
  let fixture: ComponentFixture<SeasonListPage>;
  const today = new Date().toISOString();
  const season = {
    id: 'season-1',
    term: 'spring' as const,
    ageGroup: 'U6' as const,
    weeks: 8 as const,
    practiceDurationMinutes: 45 as const,
    minPlayers: 6,
    maxPlayers: 12,
    sessions: [
      { id: 'session-1', seasonId: 'season-1', weekNumber: 1, sessionNumber: 1, scheduledDate: '2026-04-04', practicePlanId: null },
      { id: 'session-2', seasonId: 'season-1', weekNumber: 2, sessionNumber: 1, scheduledDate: null, practicePlanId: null },
    ],
    createdAt: today,
    updatedAt: today,
  };

  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('kickstart-soccer.seasons', JSON.stringify([season]));
    await TestBed.configureTestingModule({
      imports: [SeasonListPage],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(SeasonListPage);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('lists saved seasons and scheduled sessions from local planning data', () => {
    expect(fixture.nativeElement.textContent).toContain('My Seasons');
    expect(fixture.nativeElement.textContent).toContain('Spring U6');
    expect(fixture.nativeElement.textContent).toContain('Scheduled practices');
    expect(fixture.nativeElement.textContent).toContain('Week 1');
    expect(fixture.nativeElement.querySelectorAll('.calendar-list li')).toHaveLength(1);
  });
});
