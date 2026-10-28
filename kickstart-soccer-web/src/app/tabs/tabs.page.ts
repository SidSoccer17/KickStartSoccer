import { Component, computed, EnvironmentInjector, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  barChartOutline,
  bookOutline,
  calendarOutline,
  ellipsisHorizontalOutline,
  homeOutline,
  peopleOutline,
  settingsOutline,
  sparklesOutline,
} from 'ionicons/icons';
import { UserRoleService, type UserRole } from '../services/user-role.service';

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterLink, RouterLinkActive],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  readonly roles = inject(UserRoleService);
  readonly isCoach = this.roles.isCoach;
  readonly mobileItems = computed(() => this.itemsForRole(this.roles.selectedRole()));
  readonly coachNavigation: NavigationItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home-outline' },
    { path: '/seasons', label: 'My Seasons', icon: 'calendar-outline' },
    { path: '/library', label: 'Drill Library', icon: 'book-outline' },
    { path: '/players', label: 'Players', icon: 'people-outline' },
    { path: '/more#ai-coach', label: 'AI Coach', icon: 'sparkles-outline' },
    { path: '/more#reports', label: 'Reports', icon: 'bar-chart-outline' },
    { path: '/more#settings', label: 'Settings', icon: 'settings-outline' },
  ];

  constructor() {
    addIcons({
      'home-outline': homeOutline,
      'calendar-outline': calendarOutline,
      'book-outline': bookOutline,
      'people-outline': peopleOutline,
      'ellipsis-horizontal-outline': ellipsisHorizontalOutline,
      'sparkles-outline': sparklesOutline,
      'bar-chart-outline': barChartOutline,
      'settings-outline': settingsOutline,
    });
  }

  private itemsForRole(role: UserRole | null): NavigationItem[] {
    const items: NavigationItem[] = [
      { path: '/dashboard', label: 'Home', icon: 'home-outline' },
      { path: '/library', label: 'Library', icon: 'book-outline' },
      { path: '/more', label: 'More', icon: 'ellipsis-horizontal-outline' },
    ];

    if (role === 'coach') {
      items.splice(1, 0, { path: '/plan', label: 'Plan', icon: 'calendar-outline' });
      items.splice(3, 0, { path: '/players', label: 'Players', icon: 'people-outline' });
    }

    return items;
  }
}
