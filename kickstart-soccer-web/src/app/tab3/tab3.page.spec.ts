import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Drill } from '../services/api.service';
import { PracticeSelectionService } from '../services/practice-selection.service';
import { Tab3Page } from './tab3.page';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;
  let httpTestingController: HttpTestingController;
  let practiceSelection: PracticeSelectionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tab3Page],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    practiceSelection = TestBed.inject(PracticeSelectionService);
    fixture = TestBed.createComponent(Tab3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create and show the dashboard metrics', () => {
    httpTestingController.expectOne('http://localhost:8080/api/drills').flush([]);
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Coach Dashboard');
    expect(fixture.nativeElement.textContent).toContain('Available drills');
    expect(fixture.nativeElement.textContent).toContain('Practice selections');
  });

  it('loads and displays drills from the API', () => {
    const drills: Drill[] = [
      {
        id: 'drill-1',
        title: 'Gate Passing',
        ageGroups: ['U6', 'U7'],
        category: 'Passing',
        difficulty: 'Beginner',
        durationMinutes: 6,
        instructions: ['Pass through a cone gate.'],
        coachingTips: ['Use the inside of the foot.'],
        equipment: ['Soccer balls', 'Cones'],
      },
    ];

    httpTestingController.expectOne('http://localhost:8080/api/drills').flush(drills);
    fixture.detectChanges();

    expect(component.drills()).toEqual(drills);
    expect(fixture.nativeElement.textContent).toContain('Gate Passing');
    expect(fixture.nativeElement.textContent).toContain('6 min');
  });

  it('adds an API drill to the shared practice plan', () => {
    const drill: Drill = {
      id: 'drill-1',
      title: 'Gate Passing',
      ageGroups: ['U6'],
      category: 'Passing',
      difficulty: 'Beginner',
      durationMinutes: 6,
      instructions: ['Pass through a cone gate.'],
      coachingTips: [],
      equipment: [],
    };

    httpTestingController.expectOne('http://localhost:8080/api/drills').flush([drill]);
    fixture.detectChanges();
    const addButton = fixture.nativeElement.querySelector('.add-button') as HTMLButtonElement;
    addButton.click();
    fixture.detectChanges();

    expect(practiceSelection.drills()).toEqual([drill]);
    expect(component.selectionCount()).toBe(1);
    expect(addButton.textContent).toContain('Already selected');
  });

  it('prevents duplicate drill IDs and clearly identifies the selected drill', () => {
    const drill: Drill = {
      id: 'drill-1',
      title: 'Gate Passing',
      ageGroups: ['U6'],
      category: 'Passing',
      difficulty: 'Beginner',
      durationMinutes: 6,
      instructions: ['Pass through a cone gate.'],
      coachingTips: [],
      equipment: [],
    };
    practiceSelection.add(drill);

    httpTestingController.expectOne('http://localhost:8080/api/drills').flush([drill]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.add-button')).toHaveProperty('disabled', true);
    expect(fixture.nativeElement.querySelector('.add-button').textContent).toContain('Already selected');
    component.addToPractice(drill);
    fixture.detectChanges();

    expect(practiceSelection.drills()).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Gate Passing is already selected');
  });


  it('filters by age and category through the API and searches the returned drills by name', () => {
    const first: Drill = {
      id: 'd01', curriculumId: 'D01', title: 'Red Light, Green Light', ageGroups: ['U6', 'U7'],
      category: 'Ball Mastery and Warm-ups', difficulty: 'beginner', durationMinutes: 7,
      minimumDurationMinutes: 6, maximumDurationMinutes: 8, instructions: ['Stop the ball on red.'],
      coachingTips: ['Look up.'], equipment: ['Balls'], primarySkill: 'Dribbling',
    };
    const second: Drill = {
      ...first, id: 'd08', curriculumId: 'D08', title: 'Gates Dribbling',
      category: 'Dribbling and Turning', primarySkill: 'Dribbling',
    };
    httpTestingController.expectOne('http://localhost:8080/api/drills').flush([first, second]);
    fixture.detectChanges();

    const age = fixture.nativeElement.querySelector('#age-filter') as HTMLSelectElement;
    age.value = 'U6';
    age.dispatchEvent(new Event('change'));
    const ageRequest = httpTestingController.expectOne('http://localhost:8080/api/drills?age=U6');
    expect(ageRequest.request.method).toBe('GET');
    ageRequest.flush([first, second]);

    const category = fixture.nativeElement.querySelector('#category-filter') as HTMLSelectElement;
    category.value = 'Dribbling and Turning';
    category.dispatchEvent(new Event('change'));
    httpTestingController.expectOne('http://localhost:8080/api/drills?age=U6&category=Dribbling%20and%20Turning').flush([second]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.drill-card')).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Gates Dribbling');

    const search = fixture.nativeElement.querySelector('#drill-search') as HTMLInputElement;
    search.value = 'no matching activity';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No drills match these filters');
  });

  it('shows an error and retry action when loading drills fails', () => {
    httpTestingController.expectOne('http://localhost:8080/api/drills').flush(
      { message: 'Service unavailable' },
      { status: 503, statusText: 'Service Unavailable' },
    );
    fixture.detectChanges();

    expect(component.errorMessage()).toContain('Could not load drills');
    expect(fixture.nativeElement.textContent).toContain('Try again');
  });
});
