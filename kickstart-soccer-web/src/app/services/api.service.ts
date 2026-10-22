import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface HealthResponse {
  status: string;
}

export interface Drill {
  id: string;
  title: string;
  ageGroups: string[];
  category: string;
  difficulty: string;
  durationMinutes: number;
  instructions: string[];
  coachingTips: string[];
  equipment: string[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/health`);
  }

  getDrills(): Observable<Drill[]> {
    return this.http.get<Drill[]>(`${this.baseUrl}/drills`);
  }
}
