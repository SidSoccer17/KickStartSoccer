import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { HomePage } from './home.page';
import { UserRoleService } from '../services/user-role.service';
import { Drill } from '../services/api.service';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let http: HttpTestingController;
  let roles: UserRoleService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    roles = TestBed.inject(UserRoleService);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('shows coach planning summaries and the available drill count', () => {
    roles.selectRole('coach');
    fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    const drills: Drill[] = [
      { id: 'one', title: 'First drill', ageGroups: [], category: 'Passing', difficulty: 'Beginner', durationMinutes: 5, instructions: [], coachingTips: [], equipment: [] },
      { id: 'two', title: 'Second drill', ageGroups: [], category: 'Passing', difficulty: 'Beginner', durationMinutes: 5, instructions: [], coachingTips: [], equipment: [] },
    ];
    http.expectOne('http://localhost:8080/api/drills').flush(drills);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Coach Dashboard');
    expect(fixture.nativeElement.textContent).toContain('Available drills');
    expect(fixture.nativeElement.textContent).toContain('2');
  });

  it.each(['parent', 'player'] as const)('does not show coach tools for the %s role', (role) => {
    roles.selectRole(role);
    fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(`${role[0].toUpperCase()}${role.slice(1)} Home`);
    expect(fixture.nativeElement.textContent).toContain(role === 'parent' ? 'Family accounts' : 'Player sign-in');
    expect(fixture.nativeElement.textContent).not.toContain('Coach Dashboard');
    http.expectNone('http://localhost:8080/api/drills');
  });
});
