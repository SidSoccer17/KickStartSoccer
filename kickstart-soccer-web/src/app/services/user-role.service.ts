import { computed, Injectable, signal } from '@angular/core';

export type UserRole = 'coach' | 'parent' | 'player';

const ROLE_STORAGE_KEY = 'kickstart-soccer.user-role';

function isUserRole(value: string | null): value is UserRole {
  return value === 'coach' || value === 'parent' || value === 'player';
}

@Injectable({ providedIn: 'root' })
export class UserRoleService {
  readonly selectedRole = signal<UserRole | null>(null);
  readonly isCoach = computed(() => this.selectedRole() === 'coach');
  readonly persistenceError = signal<string | null>(null);

  constructor() {
    try {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      this.selectedRole.set(isUserRole(savedRole) ? savedRole : null);
    } catch {
      this.persistenceError.set('Your role preference could not be loaded from this device.');
    }
  }

  selectRole(role: UserRole): void {
    this.selectedRole.set(role);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
      this.persistenceError.set(null);
    } catch {
      this.persistenceError.set('Your role preference could not be saved on this device.');
    }
  }

  clearRole(): void {
    this.selectedRole.set(null);
    try {
      localStorage.removeItem(ROLE_STORAGE_KEY);
      this.persistenceError.set(null);
    } catch {
      this.persistenceError.set('Your saved role preference could not be removed from this device.');
    }
  }
}
