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

  /** Expose current params for children that need them (e.g. champions) */
  readonly routeParams$ = this.params$.asObservable();

  /** Summary VM (loading/error included) */
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

  /** Called by parent when the route changes */
  setParams(p: Params) {
    this.params$.next(p);
  }

  /** Manual refresh */
  refresh() {
    this.force$.next(true);
    // reset so subsequent refreshes trigger again with same params
    queueMicrotask(() => this.force$.next(false));
  }
}
