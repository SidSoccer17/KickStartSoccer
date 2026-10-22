import { computed, inject, Injectable, signal } from '@angular/core';
import { Drill } from './api.service';
import { createPracticePlan, PracticePlan } from '../models/practice-plan.model';
import { PRACTICE_PLAN_STORAGE, PracticePlanStorage } from './practice-plan-storage.service';

@Injectable({ providedIn: 'root' })
export class PracticeSelectionService {
  private readonly storage = inject(PRACTICE_PLAN_STORAGE);
  readonly savedPractices = signal<PracticePlan[]>([]);
  readonly draft = signal<PracticePlan>(createPracticePlan());
  readonly drills = computed(() => this.draft().drills);
  readonly name = computed(() => this.draft().name);
  readonly selectionCount = computed(() => this.drills().length);
  readonly totalDurationMinutes = computed(() =>
    this.drills().reduce((total, drill) => total + drill.durationMinutes, 0),
  );
  readonly isDirty = computed(() => {
    const draft = this.draft();
    const saved = this.savedPractices().find((practice) => practice.id === draft.id);
    return saved
      ? saved.name !== draft.name || JSON.stringify(saved.drills) !== JSON.stringify(draft.drills)
      : draft.name.trim().length > 0 || draft.drills.length > 0;
  });
  readonly persistenceError = signal<string | null>(null);

  constructor() {
    try {
      this.savedPractices.set(this.storage.loadSavedPractices());
      this.draft.set(this.storage.loadDraft() ?? createPracticePlan());
    } catch {
      this.persistenceError.set('Local practice data could not be loaded.');
    }
  }

  isSelected(drillId: string): boolean {
    return this.drills().some((drill) => drill.id === drillId);
  }

  setName(name: string): void {
    this.updateDraft({ name });
  }

  add(drill: Drill): boolean {
    if (this.isSelected(drill.id)) {
      return false;
    }

    this.updateDraft({ drills: [...this.drills(), drill] });
    return true;
  }

  remove(drillId: string): void {
    this.updateDraft({ drills: this.drills().filter((drill) => drill.id !== drillId) });
  }

  move(drillId: string, offset: -1 | 1): void {
    const selected = this.drills();
    const from = selected.findIndex((drill) => drill.id === drillId);
    const to = from + offset;

    if (from < 0 || to < 0 || to >= selected.length) {
      return;
    }

    const reordered = [...selected];
    [reordered[from], reordered[to]] = [reordered[to], reordered[from]];
    this.updateDraft({ drills: reordered });
  }

  clear(): void {
    this.updateDraft({ drills: [] });
  }

  openPractice(practiceId: string): boolean {
    const practice = this.savedPractices().find((candidate) => candidate.id === practiceId);
    if (!practice) {
      return false;
    }

    this.draft.set({ ...practice, drills: [...practice.drills] });
    this.persistDraft();
    return true;
  }

  saveCurrent(): boolean {
    const draft = this.draft();
    const name = draft.name.trim();
    if (!name) {
      return false;
    }

    const current = this.savedPractices();
    const existing = current.find((practice) => practice.id === draft.id);
    const saved: PracticePlan = {
      ...draft,
      name,
      drills: [...draft.drills],
      createdAt: existing?.createdAt ?? draft.createdAt,
      updatedAt: new Date().toISOString(),
    };
    const next = existing
      ? current.map((practice) => (practice.id === saved.id ? saved : practice))
      : [...current, saved];

    try {
      this.storage.saveSavedPractices(next);
      this.savedPractices.set(next);
      this.draft.set(saved);
      this.persistenceError.set(null);
      this.persistDraft();
      return true;
    } catch {
      this.persistenceError.set('Practice could not be saved to this device.');
      return false;
    }
  }

  deletePractice(practiceId: string): boolean {
    const next = this.savedPractices().filter((practice) => practice.id !== practiceId);
    if (next.length === this.savedPractices().length) {
      return false;
    }

    try {
      this.storage.saveSavedPractices(next);
      this.savedPractices.set(next);
      this.persistenceError.set(null);
      if (this.draft().id === practiceId) {
        const current = this.draft();
        this.draft.set({
          ...createPracticePlan(current.name),
          drills: [...current.drills],
        });
        this.persistDraft();
      }
      return true;
    } catch {
      this.persistenceError.set('Saved practice could not be deleted from this device.');
      return false;
    }
  }

  newPractice(): void {
    this.draft.set(createPracticePlan());
    this.persistDraft();
  }

  private updateDraft(changes: Partial<PracticePlan>): void {
    this.draft.update((draft) => ({
      ...draft,
      ...changes,
      updatedAt: new Date().toISOString(),
    }));
    this.persistDraft();
  }

  private persistDraft(): void {
    try {
      this.storage.saveDraft(this.draft());
      this.persistenceError.set(null);
    } catch {
      this.persistenceError.set('Draft could not be saved to this device.');
    }
  }
}
