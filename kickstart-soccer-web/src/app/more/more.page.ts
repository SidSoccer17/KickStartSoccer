import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { UserRoleService } from '../services/user-role.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrl: './more.page.scss',
  imports: [IonContent, RouterLink],
})
export class MorePage {
  readonly roles = inject(UserRoleService);
  private readonly router = inject(Router);

  changeRole(): void {
    this.roles.clearRole();
    void this.router.navigateByUrl('/onboarding');
  }
}
