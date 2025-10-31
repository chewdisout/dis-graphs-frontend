import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummonerStore } from '../summoner.store';

@Component({
  selector: 'app-summoner-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  store = inject(SummonerStore);
  summary$ = this.store.summary$;
}
