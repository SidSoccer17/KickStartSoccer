import { Component, EnvironmentInjector, inject, signal } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  readonly isWelcomeScreen = signal(false);
  private readonly router = inject(Router);

  constructor() {
    addIcons({ triangle, ellipse, square });
    this.isWelcomeScreen.set(this.router.url === '/tabs/tab1');
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.isWelcomeScreen.set(event.urlAfterRedirects === '/tabs/tab1');
      });
  }
}
