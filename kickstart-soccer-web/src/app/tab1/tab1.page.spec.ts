import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Tab1Page } from './tab1.page';
import { UserRoleService } from '../services/user-role.service';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let router: Router;
  let roles: UserRoleService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Tab1Page],
      providers: [provideRouter([])],
    }).compileComponents();

    router = TestBed.inject(Router);
    roles = TestBed.inject(UserRoleService);
    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selects the chosen role', () => {
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    component.selectRole('coach');
    expect(component.selectedRole()).toBe('coach');
    expect(roles.selectedRole()).toBeNull();

    component.selectRole('parent');
    expect(component.selectedRole()).toBe('parent');
  });

  it('requires an explicit start action before entering the role-aware Home', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    component.selectRole('coach');

    expect(navigateSpy).not.toHaveBeenCalled();
    component.start();

    expect(roles.selectedRole()).toBe('coach');
    expect(localStorage.getItem('kickstart-soccer.user-role')).toBe('coach');
    expect(navigateSpy).toHaveBeenCalledWith('/dashboard');
  });

  it('does not continue until a role is selected', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    component.start();

    expect(roles.selectedRole()).toBeNull();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('shows the continue button disabled until a role is selected', () => {
    const button = fixture.nativeElement.querySelector('.start-button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    component.selectRole('coach');
    fixture.detectChanges();

    expect(button.disabled).toBe(false);
  });

  it('preselects the previously saved role when onboarding is shown again', () => {
    roles.selectRole('parent');
    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.selectedRole()).toBe('parent');
    const selectedButton = fixture.nativeElement.querySelector('[aria-pressed="true"]');
    expect(selectedButton.textContent).toContain('Parent');
  });

  it.each(['parent', 'player'] as const)('continues as %s to its role-aware Home experience', (role) => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    component.selectRole(role);
    component.start();

    expect(roles.selectedRole()).toBe(role);
    expect(navigateSpy).toHaveBeenCalledWith('/dashboard');
  });
});
