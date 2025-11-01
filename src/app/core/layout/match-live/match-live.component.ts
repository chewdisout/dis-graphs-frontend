import { Component, Input, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, of, interval } from "rxjs";
import { map, switchMap, startWith, combineLatestWith } from "rxjs/operators";
import { AsyncPipe, DatePipe, CommonModule } from "@angular/common";

import { MatchService } from "../../../services/match/match.service";
import { MatchLive } from "../../../models/match/match-live.model";

type Participant = NonNullable<MatchLive['participants']>[number];

type LiveParticipantVM = Participant & {
  __role: 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT' | 'UNK';
  spell1Icon: string;
  spell2Icon: string;
};

type MatchLiveVM = MatchLive & {
  blue: LiveParticipantVM[];
  red: LiveParticipantVM[];
  elapsedSeconds: number;
};

@Component({
  selector: 'app-match-live',
  standalone: true,
  templateUrl: './match-live.component.html',
  styleUrls: ['./match-live.component.scss'],
  imports: [CommonModule, AsyncPipe, DatePipe],
})
export class MatchLiveComponent {
  @Input() region?: string;
  @Input() gameName?: string;
  @Input() tagLine?: string;

  vm$!: Observable<MatchLiveVM>;

  private route = inject(ActivatedRoute);
  private matchSvc = inject(MatchService);

  private SPELL_ICON: Record<number, string> = {
    1:'SummonerBoost.png', 3:'SummonerExhaust.png', 4:'SummonerFlash.png',
    6:'SummonerHaste.png', 7:'SummonerHeal.png',    11:'SummonerSmite.png',
    12:'SummonerTeleport.png', 13:'SummonerMana.png', 14:'SummonerDot.png',
    21:'SummonerBarrier.png', 32:'SummonerSnowball.png'
  };
  private spellIconUrl = (id?: number) =>
    id ? `https://ddragon.leagueoflegends.com/cdn/15.21.1/img/spell/${this.SPELL_ICON[id] || 'SummonerFlash.png'}` : '';

  private roleOf(p: Participant): LiveParticipantVM["__role"] {
    const s1 = p.spell1Id, s2 = p.spell2Id;
    const has = (id: number) => s1 === id || s2 === id;
    if (has(11)) return 'JUNGLE';
    if (has(7))  return 'ADC';
    if (has(3))  return 'SUPPORT';
    if (has(12)) return 'TOP';
    if (has(14)) return 'MID';
    return 'UNK';
  }
  private laneOrder: LiveParticipantVM["__role"][] = ['TOP','JUNGLE','MID','ADC','SUPPORT','UNK'];
  private sortTeam(arr: MatchLive["participants"] = []): LiveParticipantVM[] {
    return arr
      .map(p => ({
        ...p,
        __role: this.roleOf(p),
        spell1Icon: this.spellIconUrl(p.spell1Id),
        spell2Icon: this.spellIconUrl(p.spell2Id),
      }))
      .sort((a, b) => this.laneOrder.indexOf(a.__role) - this.laneOrder.indexOf(b.__role));
  }

  ngOnInit() {
    const paramStream =
      (this.region && this.gameName && this.tagLine)
        ? of({ region: this.region!, gameName: this.gameName!, tagLine: this.tagLine! })
        : this.route.parent!.paramMap.pipe(
            map(p => ({
              region:  p.get('region') ?? '',
              gameName: p.get('name') ?? '',
              tagLine:  p.get('tagLine') ?? '',
            }))
          );

    const live$ = paramStream.pipe(
      switchMap(p => this.matchSvc.getLiveMatch(p.gameName, p.tagLine, p.region))
    );

    this.vm$ = live$.pipe(
      map((live: MatchLive): MatchLiveVM => {
        console.log(live);
        if (!live?.inGame) {
          return { ...(live || {} as MatchLive), blue: [], red: [], elapsedSeconds: 0 };
        }
        const blue = this.sortTeam((live.participants || []).filter(p => (p as any).team === 'BLUE' || (p as any).teamId === 100));
        const red  = this.sortTeam((live.participants || []).filter(p => (p as any).team === 'RED'  || (p as any).teamId === 200));
        return { ...live, blue, red, elapsedSeconds: Math.max(0, Math.floor(((live.gameLength ?? 0)) )) } as MatchLiveVM;
      }),
      combineLatestWith(interval(1000).pipe(startWith(0))),
      map(([vm]) => {
        if (!vm.inGame) return vm;
        const base = vm.gameStartTime ? Math.floor((Date.now() - vm.gameStartTime) / 1000) : (vm.gameLength ?? 0);
        
        return { ...vm, elapsedSeconds: Math.max(0, base) };
      })
    );
  }
}
