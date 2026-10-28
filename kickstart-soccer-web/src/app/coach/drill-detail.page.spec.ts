import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Drill } from '../services/api.service';
import { DrillDetailPage } from './drill-detail.page';

describe('DrillDetailPage', () => {
  let fixture: ComponentFixture<DrillDetailPage>;
  let http: HttpTestingController;
  const drill: Drill = {
    id: '00000000-0000-0000-0000-000000000001', curriculumId: 'D01', title: 'Red Light, Green Light',
    diagramKey: 'red-light-green-light', ageGroups: ['U5', 'U6', 'U7'], category: 'Ball Mastery and Warm-ups',
    difficulty: 'beginner', durationMinutes: 7, minimumDurationMinutes: 6, maximumDurationMinutes: 8,
    minimumAge: 5, maximumAge: 7, minimumPlayers: 1, primarySkill: 'Dribbling', secondarySkills: ['Ball control'],
    whatItTeaches: 'Close control and stopping the ball.',
    setupInstructions: ['Mark a 20-by-25-yard area.'],
    instructions: ['Give every player a ball.', 'On green, dribble; on red, stop the ball.'],
    coachingTips: ['Look up between touches.', 'Stop with the sole.', 'Turn into open space.'],
    equipment: ['One ball per player', 'Cones'], easierVariations: ['Use two commands.'],
    harderVariations: ['Add a yellow slow-down command.'], safetyConsiderations: ['Keep space between players.'],
    contentSource: 'Original KickStart Soccer curriculum content',
  };
  const route = { snapshot: { paramMap: { get: () => drill.id } } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrillDetailPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), { provide: ActivatedRoute, useValue: route }],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DrillDetailPage);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('loads full drill instructions, variations, and safety details', () => {
    http.expectOne(`http://localhost:8080/api/drills/${drill.id}`).flush(drill);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Mark a 20-by-25-yard area.');
    expect(fixture.nativeElement.textContent).toContain('On green, dribble; on red, stop the ball.');
    expect(fixture.nativeElement.textContent).toContain('Add a yellow slow-down command.');
    expect(fixture.nativeElement.textContent).toContain('Keep space between players.');
    expect(fixture.nativeElement.querySelector('app-field-diagram svg').getAttribute('aria-label')).toContain('Red Light');
  });
});
