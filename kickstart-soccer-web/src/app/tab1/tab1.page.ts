import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';

type RoleId = 'coach' | 'parent' | 'player';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonContent]
})
export class Tab1Page {
  private readonly router = inject(Router);

  readonly roles: ReadonlyArray<{
    id: RoleId;
    label: string;
    description: string;
  }> = [
    { id: 'coach', label: 'Coach', description: 'I coach a team' },
    { id: 'parent', label: 'Parent', description: 'I want to help my child' },
    { id: 'player', label: 'Player', description: 'I want to learn and have fun' }
  ];

  readonly selectedRole = signal<RoleId | null>(null);

  selectRole(role: RoleId): void {
    this.selectedRole.set(role);

    if (role === 'coach') {
      void this.router.navigateByUrl('/tabs/tab3');
    }
  }

  roleLabel(roleId: RoleId): string {
    return this.roles.find((role) => role.id === roleId)?.label ?? roleId;
  }
}
