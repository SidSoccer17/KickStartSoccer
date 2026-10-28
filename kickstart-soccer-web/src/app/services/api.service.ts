import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';

export interface HealthResponse {
  status: string;
}

export interface Drill {
  id: string;
  title: string;
  name?: string | null;
  recommendedDurationMinutes?: number | null;
  diagramKey?: string | null;
  ageGroups: string[];
  category: string;
  difficulty: string;
  durationMinutes: number;
  instructions: string[];
  coachingTips: string[];
  equipment: string[];
  curriculumId?: string | null;
  primarySkill?: string | null;
  secondarySkills?: string[] | null;
  minimumAge?: number | null;
  maximumAge?: number | null;
  minimumDurationMinutes?: number | null;
  maximumDurationMinutes?: number | null;
  minimumPlayers?: number | null;
  whatItTeaches?: string | null;
  setupInstructions?: string[] | null;
  easierVariations?: string[] | null;
  harderVariations?: string[] | null;
  safetyConsiderations?: string[] | null;
  contentSource?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/health`);
  }

  getDrills(filters: { age?: string; category?: string } = {}): Observable<Drill[]> {
    let params = new HttpParams();
    if (filters.age) params = params.set('age', filters.age);
    if (filters.category) params = params.set('category', filters.category);
    return this.http.get<Drill[]>(`${this.baseUrl}/drills`, { params });
  }

  getDrill(id: string): Observable<Drill> {
    return this.http.get<Drill>(`${this.baseUrl}/drills/${encodeURIComponent(id)}`);
  }
}
