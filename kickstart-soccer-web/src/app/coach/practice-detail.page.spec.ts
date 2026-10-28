import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { PracticePlan } from '../models/practice-plan.model';
import { PracticeDetailPage } from './practice-detail.page';

const plan: PracticePlan = {
  id: 'plan-1', name: 'Test practice', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  drills: [
    { id: 'drill-1', title: 'Gate Passing', diagramKey: 'gate-passing', ageGroups: ['U6'], category: 'Passing', difficulty: 'Beginner', durationMinutes: 6, instructions: ['Pass through a gate.'], equipment: ['Cones'], coachingTips: ['Use the inside of the foot.'] },
    { id: 'drill-2', title: 'Red Light, Green Light', diagramKey: 'red-light-green-light', ageGroups: ['U6'], category: 'Dribbling', difficulty: 'Beginner', durationMinutes: 5, instructions: ['Dribble on green.'], equipment: ['Balls'], coachingTips: ['Keep the ball close.'] },
  ],
};

describe('PracticeDetailPage', () => {
  let fixture: ComponentFixture<PracticeDetailPage>;
  const route = { snapshot: { paramMap: { get: () => 'plan-1' }, queryParamMap: { get: () => 'season-1' } } };

  beforeEach(async () => {
    localStorage.setItem('kickstart-soccer.saved-practices', JSON.stringify([plan]));
    await TestBed.configureTestingModule({ imports: [PracticeDetailPage], providers: [provideRouter([]), { provide: ActivatedRoute, useValue: route }] }).compileComponents();
    fixture = TestBed.createComponent(PracticeDetailPage);
    fixture.detectChanges();
  });

  afterEach(() => { localStorage.clear(); TestBed.resetTestingModule(); });

  it('shows drill details and navigates between activities with both static diagrams', () => {
    expect(fixture.nativeElement.textContent).toContain('Pass through a gate.');
    expect(fixture.nativeElement.textContent).toContain('Cones');
    expect(fixture.nativeElement.textContent).toContain('Use the inside of the foot.');
    expect(fixture.nativeElement.querySelector('app-field-diagram svg').getAttribute('aria-label')).toContain('Gate Passing');
    fixture.nativeElement.querySelector('[aria-label="Practice activity navigation"] button:last-child').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Dribble on green.');
    expect(fixture.nativeElement.querySelector('app-field-diagram svg').getAttribute('aria-label')).toContain('Red Light, Green Light');
    fixture.nativeElement.querySelector('[aria-label="Practice activity navigation"] button:first-child').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Activity 1 of 2');
  });
});
