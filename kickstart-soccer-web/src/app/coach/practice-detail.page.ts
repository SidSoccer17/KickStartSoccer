import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { FieldDiagramComponent } from './field-diagram.component';
import { PracticeSelectionService } from '../services/practice-selection.service';

@Component({ selector: 'app-practice-detail', templateUrl: './practice-detail.page.html', styleUrl: './practice-detail.page.scss', imports: [IonContent, RouterLink, FieldDiagramComponent] })
export class PracticeDetailPage {
  private readonly route = inject(ActivatedRoute);
  readonly practices = inject(PracticeSelectionService);
  readonly activeIndex = signal(0);
  readonly practice = computed(() => this.practices.savedPractices().find((item) => item.id === (this.route.snapshot.paramMap.get('practiceId') ?? '')));
  readonly activity = computed(() => this.practice()?.drills[this.activeIndex()] ?? null);
  readonly seasonId = this.route.snapshot.queryParamMap.get('seasonId');

  totalDuration(): number { return this.practice()?.drills.reduce((total, drill) => total + drill.durationMinutes, 0) ?? 0; }
  previous(): void { this.activeIndex.update((index) => Math.max(0, index - 1)); }
  next(): void { this.activeIndex.update((index) => Math.min((this.practice()?.drills.length ?? 1) - 1, index + 1)); }
}
