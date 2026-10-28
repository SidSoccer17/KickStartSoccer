import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TabsPage } from './tabs.page';
import { UserRoleService } from '../services/user-role.service';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let roles: UserRoleService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TabsPage],
      providers: [provideRouter([])]
    }).compileComponents();
    roles = TestBed.inject(UserRoleService);
  });

  const createFixture = () => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', () => {
    roles.selectRole('coach');
    createFixture();
    expect(component).toBeTruthy();
  });

  it('shows coach mobile tabs and the coach desktop sidebar', () => {
    roles.selectRole('coach');
    createFixture();

    expect(component.mobileItems().map((item) => item.label)).toEqual([
      'Home',
      'Plan',
      'Library',
      'Players',
      'More',
    ]);
    const sidebar = fixture.nativeElement.querySelector('.sidebar-links') as HTMLElement;
    const sidebarText = (sidebar.textContent ?? '').replace(/\s+/g, '');
    expect(sidebarText).toBe('DashboardMySeasonsDrillLibraryPlayersAICoachReportsSettings');
  });

  it.each(['parent', 'player'] as const)('keeps %s navigation focused on available shared destinations', (role) => {
    roles.selectRole(role);
    createFixture();

    expect(component.mobileItems().map((item) => item.label)).toEqual(['Home', 'Library', 'More']);
    expect(fixture.nativeElement.querySelector('.coach-sidebar')).toBeNull();
  });
});
