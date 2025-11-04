import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SummonerService } from '../../services/summoner/summoner.service';
import { SummonerSummary } from '../../models/summoner-info/summoner-summary.model';

type Params = { region: string; gameName: string; tagLine: string };

@Injectable()
export class SummonerStore {
  private api = inject(SummonerService);

  private params$ = new BehaviorSubject<Params>({ region: '', gameName: '', tagLine: '' });
  private force$  = new BehaviorSubject<boolean>(false);

  readonly routeParams$ = this.params$.asObservable();

  readonly summary$ = combineLatest([this.params$, this.force$]).pipe(
    switchMap(([p, force]) =>
      this.api.getSummonerSummary(p.region, p.gameName, p.tagLine, force).pipe(
        map((res: any) => {
          const primaryRank   = res.ranks?.find((r: any) => r.queueType === 'RANKED_SOLO_5x5') ?? null;
          const secondaryRank = res.ranks?.find((r: any) => r.queueType === 'RANKED_FLEX_SR') ?? null;
          return { ...res, loading: false, error: '', primaryRank, secondaryRank } as SummonerSummary & any;
        }),
        startWith({ loading: true, profile: null }),
        catchError(() => of({ loading: false, error: 'Not found', profile: null }))
      )
    )
  );

  setParams(p: Params) {
    this.params$.next(p);
  }

  refresh() {
    this.force$.next(true);
    queueMicrotask(() => this.force$.next(false));
  }
}
