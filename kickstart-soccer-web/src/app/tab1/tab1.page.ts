import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { UserRoleService, type UserRole } from '../services/user-role.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonContent]
})
export class Tab1Page {
  private readonly router = inject(Router);
  readonly roleService = inject(UserRoleService);

  readonly roles: ReadonlyArray<{
    id: UserRole;
    label: string;
    description: string;
  }> = [
    { id: 'coach', label: 'Coach', description: 'I coach a team' },
    { id: 'parent', label: 'Parent', description: 'I want to help my child' },
    { id: 'player', label: 'Player', description: 'I want to learn and have fun' }
  ];

  readonly selectedRole = signal<UserRole | null>(this.roleService.selectedRole());

  selectRole(role: UserRole): void {
    this.selectedRole.set(role);
  }

  start(): void {
    const role = this.selectedRole();
    if (!role) return;

    this.roleService.selectRole(role);
    void this.router.navigateByUrl('/dashboard');
  }

  roleLabel(roleId: UserRole): string {
    return this.roles.find((role) => role.id === roleId)?.label ?? roleId;
  }
}
