import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormControl, FormsModule } from '@angular/forms';
import { Summoner } from '../../../models/summoner-info/summoner.model';
import { SummonerService } from '../../../services/summoner/summoner.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  searchCtrl = new FormControl('');
  loadingSearch = false;
  




  isDark = true;
  currentLang = 'en';

  summoner?: Summoner;
  nameAndTag: string = '';
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
    if (!this.nameAndTag || !this.region) {
      alert('Please fill in all fields');
      this.loading = false;
      return;
    }

    this.summonerService.getSummoner(this.nameAndTag.split('#')[0], this.nameAndTag.split('#')[1], this.region).subscribe({
      next: data => {
        if (!data || data.error) {
          alert('Player not found');
          return;
        }

        this.summoner = data;
        this.route.navigate([`/summoner/${this.region}/${this.summoner.summoner_name}/${this.nameAndTag.split('#')[1]}`]);
      },
      error: () => {
        this.summoner = undefined;
      }
    });
  }
}
