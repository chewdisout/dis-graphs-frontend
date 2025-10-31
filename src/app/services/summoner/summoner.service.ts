import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SummonerSummary } from '../../models/summoner-info/summoner-summary.model';
import { Summoner } from '../../models/summoner-info/summoner.model';
import { SummonerRank } from '../../models/summoner-info/summoner-rank.model';
import { SummonerTopMastery } from '../../models/summoner-info/summoner-topmastery.model';
import { SummonerMastery } from '../../models/summoner-info/summoner-mastery';

@Injectable({
  providedIn: 'root'
})
export class SummonerService {
  private apiUrl = 'http://localhost:8000'; // FastAPI backend

  constructor(private http: HttpClient) {}

  getSummoner(name: string, tag: string, region: string): Observable<Summoner> {
    console.log(`Fetching player: ${name}#${tag} from region: ${region}`);
    return this.http.get<Summoner>(`${this.apiUrl}/player/${region}/${name}/${tag}`);
  }

  getRanks(region: string, gameName: string, tagLine: string): Observable<SummonerRank[]> {
    console.log(`Fetching ranks for: ${gameName}#${tagLine} from region: ${region}`);
    return this.http.get<SummonerRank[]>(`${this.apiUrl}/player/ranks`, { params: { region, gameName, tagLine } });
  }

  getTopMastery(region: string, gameName: string, tagLine: string): Observable<SummonerTopMastery[]> {
    return this.http.get<SummonerTopMastery[]>(`${this.apiUrl}/player/mastery/top`, { params: { region, gameName, tagLine }});
  }

  getSummonerSummary(region: string, gameName: string, tagLine: string, force = false): Observable<SummonerSummary> {
    const params = { region, gameName, tagLine, force };
    return this.http.get<SummonerSummary>(`${this.apiUrl}/player/summary`, { params });
  }

  getSummonerMastery(region: string, gameName: string, tagLine: string, refresh: boolean): Observable<SummonerMastery[]> {
    return this.http.get<SummonerMastery[]>(`${this.apiUrl}/player/mastery/all`, { params: { region, gameName, tagLine, refresh }});
  }
}
