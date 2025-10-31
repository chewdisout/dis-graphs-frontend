import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SummonerStore } from './summoner.store';

@Component({
  selector: 'app-summoner',
  imports: [CommonModule, FormsModule, TranslateModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './summoner.component.html',
  styleUrl: './summoner.component.scss',
})

export class SummonerPage {
  private route = inject(ActivatedRoute);
  store = inject(SummonerStore);

  // Parent also uses the summary for header (name, region buttons, etc.)
  summary$ = this.store.summary$;

  ngOnInit() {
    this.route.paramMap.pipe(
      map(p => ({
        region:  p.get('region') ?? '',
        // accept either :name/:tagLine or :player/:tag to be defensive
        gameName: p.get('name') ?? p.get('player') ?? '',
        tagLine:  p.get('tagLine') ?? p.get('tag') ?? '',
      }))
    ).subscribe(params => this.store.setParams(params));
  }

  refresh() { this.store.refresh(); }
}
