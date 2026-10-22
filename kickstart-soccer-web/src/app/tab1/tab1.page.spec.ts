import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tab1Page],
      providers: [provideRouter([])],
    }).compileComponents();

    router = TestBed.inject(Router);
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

    component.selectRole('parent');
    expect(component.selectedRole()).toBe('parent');
  });

  it('navigates coaches to the Training tab', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    component.selectRole('coach');

    expect(navigateSpy).toHaveBeenCalledWith('/tabs/tab3');
  });

  it('does not navigate non-coach roles', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');

    component.selectRole('player');

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
