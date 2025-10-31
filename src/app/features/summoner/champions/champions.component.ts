import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummonerStore } from '../summoner.store';
import { SummonerService } from '../../../services/summoner/summoner.service';
import { switchMap, map, startWith, catchError, of } from 'rxjs';
import { SummonerTopMastery } from '../../../models/summoner-info/summoner-topmastery.model';

@Component({
  selector: 'app-champions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './champions.component.html',
  styleUrls: ['./champions.component.scss'],
})
export class ChampionsComponent {
  private store = inject(SummonerStore);
  private api = inject(SummonerService);

  // UI state used by template
  query = signal<string>('');
  sortBy = signal<'points' | 'level' | 'last'>('points');

  // Viewmodel: fetch all masteries using route params from the store
  vm$ = this.store.routeParams$.pipe(
    switchMap(({ region, gameName, tagLine }) =>
      this.api.getSummonerMastery(region, gameName, tagLine, false).pipe(
        map((rows: SummonerTopMastery[]) => ({ loading: false, error: '', rows })),
        startWith({ loading: true, error: '', rows: [] as SummonerTopMastery[] }),
        catchError(() => of({ loading: false, error: 'Failed to load champions', rows: [] as SummonerTopMastery[] }))
      )
    )
  );

  // Template event handlers (avoid TS casts in template)
  onQuery(e: Event) {
    this.query.set((e.target as HTMLInputElement).value ?? '');
  }
  onSort(e: Event) {
    this.sortBy.set(((e.target as HTMLSelectElement).value as any) ?? 'points');
  }

  // Client-side filter/sort
  filtered(rows: SummonerTopMastery[]) {
    const q = this.query().toLowerCase();
    let arr = rows.filter(r => !q || (r.championName || '').toLowerCase().includes(q));
    switch (this.sortBy()) {
      case 'level':
        arr = arr.slice().sort((a, b) => b.championLevel - a.championLevel);
        break;
      case 'last':
        const t = (d?: any) => (d ? new Date(d).getTime() : 0);
        arr = arr.slice().sort((a, b) => t(b.lastPlayTime) - t(a.lastPlayTime));
        break;
      default:
        arr = arr.slice().sort((a, b) => b.championPoints - a.championPoints);
    }
    return arr;
  }
}
