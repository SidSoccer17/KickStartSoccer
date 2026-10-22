import { Drill } from '../services/api.service';

export interface PracticePlan {
  id: string;
  name: string;
  drills: Drill[];
  createdAt: string;
  updatedAt: string;
}

export function createPracticePlan(name = ''): PracticePlan {
  const now = new Date().toISOString();
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `practice-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    drills: [],
    createdAt: now,
    updatedAt: now,
  };
}
