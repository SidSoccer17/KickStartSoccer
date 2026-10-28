import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { UserRoleService } from './services/user-role.service';
import { routes as tabRoutes } from './tabs/tabs.routes';

describe('application routes', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('redirects legacy tabs to onboarding or their feature destinations', () => {
    expect(routes.find((route) => route.path === 'tabs/tab1')?.redirectTo).toBe('/onboarding');
    expect(routes.find((route) => route.path === 'tabs/tab2')?.redirectTo).toBe('/plan');
    expect(routes.find((route) => route.path === 'home')?.redirectTo).toBe('/onboarding');
    expect(routes.find((route) => route.path === 'tabs/tab3')?.redirectTo).toBe('/dashboard');
  });

  it('uses feature routes inside the tab shell and keeps existing coach detail routes', () => {
    const shell = tabRoutes.find((route) => route.path === '');
    const children = shell?.children?.map((route) => route.path);

    expect(children).toEqual(expect.arrayContaining([
      'dashboard',
      'plan',
      'library',
      'players',
      'more',
      'seasons',
      'coach/seasons/new',
      'coach/seasons/:seasonId',
      'coach/practices/:practiceId',
      'coach/drills/:drillId',
    ]));
    expect(children).not.toEqual(expect.arrayContaining(['tab1', 'tab2', 'tab3']));
  });

  it('navigates legacy URLs to onboarding and the corresponding feature pages', async () => {
    const roles = TestBed.inject(UserRoleService);
    const router = TestBed.inject(Router);
    const http = TestBed.inject(HttpTestingController);
    roles.selectRole('coach');
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/tabs/tab1');
    expect(router.url).toBe('/onboarding');

    await harness.navigateByUrl('/tabs/tab2');
    expect(router.url).toBe('/plan');
    expect(harness.routeNativeElement?.textContent).toContain('Practice Plan');

    await harness.navigateByUrl('/tabs/tab3');
    expect(router.url).toBe('/dashboard');
    http.expectOne('http://localhost:8080/api/drills').flush([]);
    expect(harness.routeNativeElement?.textContent).toContain('Coach Dashboard');
  });

  it('uses onboarding as the app entry even when a role preference is saved', async () => {
    const router = TestBed.inject(Router);
    TestBed.inject(UserRoleService).selectRole('coach');
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/home');

    expect(router.url).toBe('/onboarding');
    expect(harness.routeNativeElement?.textContent).toContain('Who are you?');
  });

  it('redirects parent roles away from coach-only planning routes', async () => {
    const roles = TestBed.inject(UserRoleService);
    const router = TestBed.inject(Router);
    const http = TestBed.inject(HttpTestingController);
    roles.selectRole('parent');
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/plan');

    expect(router.url).toBe('/onboarding');
    expect(harness.routeNativeElement?.textContent).toContain('Who are you?');
    http.expectNone('http://localhost:8080/api/drills');
  });
});
