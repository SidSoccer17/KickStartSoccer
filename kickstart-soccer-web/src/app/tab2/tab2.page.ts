import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { PracticeSelectionService } from '../services/practice-selection.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonContent, RouterLink],
})
export class Tab2Page {
  readonly practiceSelection = inject(PracticeSelectionService);
  readonly nameError = signal<string | null>(null);
  readonly saveMessage = signal<string | null>(null);

  updateName(event: Event): void {
    this.practiceSelection.setName((event.target as HTMLInputElement).value);
    this.nameError.set(null);
    this.saveMessage.set(null);
  }

  savePractice(): void {
    if (!this.practiceSelection.name().trim()) {
      this.nameError.set('Enter a practice name before saving.');
      this.saveMessage.set(null);
      return;
    }

    if (this.practiceSelection.saveCurrent()) {
      this.saveMessage.set('Practice saved on this device.');
      this.nameError.set(null);
    } else {
      this.saveMessage.set(null);
    }
  }

  openPractice(practiceId: string): void {
    if (
      practiceId !== this.practiceSelection.draft().id &&
      this.practiceSelection.isDirty() &&
      !window.confirm('You have unsaved changes. Replace the current draft with this saved practice?')
    ) {
      return;
    }

    this.practiceSelection.openPractice(practiceId);
    this.saveMessage.set(null);
    this.nameError.set(null);
  }

  startNewPractice(): void {
    if (
      this.practiceSelection.isDirty() &&
      !window.confirm('You have unsaved changes. Start a new practice and replace the current draft?')
    ) {
      return;
    }

    this.practiceSelection.newPractice();
    this.saveMessage.set(null);
    this.nameError.set(null);
  }

  moveDrill(drillId: string, offset: -1 | 1): void {
    this.practiceSelection.move(drillId, offset);
  }

  removeDrill(drillId: string): void {
    this.practiceSelection.remove(drillId);
  }

  clearCurrentSelection(): void {
    if (
      this.practiceSelection.isDirty() &&
      !window.confirm('Clear the current practice selection? Saved practices will not be deleted.')
    ) {
      return;
    }

    this.practiceSelection.clear();
  }

  deletePractice(practiceId: string): void {
    if (window.confirm('Delete this saved practice from this device? This cannot be undone.')) {
      this.practiceSelection.deletePractice(practiceId);
    }
  }

  planDuration(practiceId: string): number {
    const practice = this.practiceSelection.savedPractices().find((item) => item.id === practiceId);
    return practice?.drills.reduce((total, drill) => total + drill.durationMinutes, 0) ?? 0;
  }
}
