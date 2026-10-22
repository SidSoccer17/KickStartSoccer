import { inject, Injectable, InjectionToken } from '@angular/core';
import { PracticePlan } from '../models/practice-plan.model';
import { Drill } from './api.service';

export abstract class PracticePlanStorage {
  abstract loadSavedPractices(): PracticePlan[];
  abstract loadDraft(): PracticePlan | null;
  abstract saveSavedPractices(practices: PracticePlan[]): void;
  abstract saveDraft(draft: PracticePlan): void;
}

const SAVED_PRACTICES_KEY = 'kickstart-soccer.saved-practices';
const CURRENT_DRAFT_KEY = 'kickstart-soccer.current-practice-draft';

@Injectable({ providedIn: 'root' })
export class LocalPracticePlanStorage extends PracticePlanStorage {
  loadSavedPractices(): PracticePlan[] {
    const parsed = this.readJson(SAVED_PRACTICES_KEY);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const practices = parsed.filter(isPracticePlan);
    return practices.filter(
      (practice, index) => practices.findIndex((candidate) => candidate.id === practice.id) === index,
    );
  }

  loadDraft(): PracticePlan | null {
    const parsed = this.readJson(CURRENT_DRAFT_KEY);
    return isPracticePlan(parsed) ? parsed : null;
  }

  saveSavedPractices(practices: PracticePlan[]): void {
    this.writeJson(SAVED_PRACTICES_KEY, practices);
  }

  saveDraft(draft: PracticePlan): void {
    this.writeJson(CURRENT_DRAFT_KEY, draft);
  }

  private readJson(key: string): unknown {
    try {
      const raw = globalThis.localStorage?.getItem(key);
      return raw === null || raw === undefined ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private writeJson(key: string, value: unknown): void {
    globalThis.localStorage.setItem(key, JSON.stringify(value));
  }
}

export const PRACTICE_PLAN_STORAGE = new InjectionToken<PracticePlanStorage>(
  'PRACTICE_PLAN_STORAGE',
  {
    providedIn: 'root',
    factory: () => inject(LocalPracticePlanStorage),
  },
);

function isPracticePlan(value: unknown): value is PracticePlan {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const plan = value as Partial<PracticePlan>;
  return (
    typeof plan.id === 'string' &&
    plan.id.length > 0 &&
    typeof plan.name === 'string' &&
    Array.isArray(plan.drills) &&
    plan.drills.every(isDrill) &&
    new Set(plan.drills.map((drill) => drill.id)).size === plan.drills.length &&
    typeof plan.createdAt === 'string' &&
    !Number.isNaN(Date.parse(plan.createdAt)) &&
    typeof plan.updatedAt === 'string' &&
    !Number.isNaN(Date.parse(plan.updatedAt))
  );
}

function isDrill(value: unknown): value is Drill {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const drill = value as Partial<Drill>;
  return (
    typeof drill.id === 'string' &&
    drill.id.length > 0 &&
    typeof drill.title === 'string' &&
    Array.isArray(drill.ageGroups) &&
    drill.ageGroups.every((item) => typeof item === 'string') &&
    typeof drill.category === 'string' &&
    typeof drill.difficulty === 'string' &&
    typeof drill.durationMinutes === 'number' &&
    Number.isFinite(drill.durationMinutes) &&
    Array.isArray(drill.instructions) &&
    drill.instructions.every((item) => typeof item === 'string') &&
    Array.isArray(drill.coachingTips) &&
    drill.coachingTips.every((item) => typeof item === 'string') &&
    Array.isArray(drill.equipment) &&
    drill.equipment.every((item) => typeof item === 'string')
  );
}
