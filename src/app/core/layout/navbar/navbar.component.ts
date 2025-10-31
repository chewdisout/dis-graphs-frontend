import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Summoner } from '../../../models/summoner-info/summoner.model';
import { SummonerService } from '../../../services/summoner/summoner.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isDark = true;
  currentLang = 'en';

  summoner?: Summoner;
  name: string = '';
  tag: string = '';
  region: string = '';
  loading = false;

  constructor(
    private translate: TranslateService, 
    private summonerService: SummonerService,
    private route: Router
  ) {
    this.translate.setDefaultLang('en');
  }

  toggleTheme() {
    const root = document.documentElement;
    this.isDark = !this.isDark;
    root.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
  }

  switchLang(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }

  search() {
    this.loading = true;
    if (!this.name || !this.tag || !this.region) {
      alert('Please fill in all fields');
      this.loading = false;
      return;
    }

    this.summonerService.getSummoner(this.name, this.tag, this.region).subscribe({
      next: data => {
        if (!data || data.error) {
          alert('Player not found');
          return;
        }

        this.summoner = data;
        this.route.navigate([`/summoner/${this.region}/${this.summoner.summoner_name}/${this.tag}`]);
      },
      error: () => {
        this.summoner = undefined;
      }
    });
  }
}
