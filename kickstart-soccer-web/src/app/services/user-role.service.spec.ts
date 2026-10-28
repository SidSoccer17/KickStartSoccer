import { TestBed } from '@angular/core/testing';
import { UserRoleService } from './user-role.service';

describe('UserRoleService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('loads and stores a supported role preference on this device', () => {
    localStorage.setItem('kickstart-soccer.user-role', 'player');
    const service = TestBed.inject(UserRoleService);

    expect(service.selectedRole()).toBe('player');
    service.selectRole('coach');
    expect(service.isCoach()).toBe(true);
    expect(localStorage.getItem('kickstart-soccer.user-role')).toBe('coach');
  });

  it('ignores invalid stored values and clears the selected role', () => {
    localStorage.setItem('kickstart-soccer.user-role', 'administrator');
    const service = TestBed.inject(UserRoleService);

    expect(service.selectedRole()).toBeNull();
    service.selectRole('parent');
    service.clearRole();
    expect(service.selectedRole()).toBeNull();
    expect(localStorage.getItem('kickstart-soccer.user-role')).toBeNull();
  });
});
