import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatchLive } from '../../models/match/match-live.model';


@Injectable({
  providedIn: 'root'
})

export class MatchService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getLiveMatch(gameName: string, tagLine: string, region: string): Observable<MatchLive> {
    return this.http.get<MatchLive>(`${this.apiUrl}/match/live`, { params: { region, gameName, tagLine } });
  }
}
