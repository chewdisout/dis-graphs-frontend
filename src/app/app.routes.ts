import { Routes } from '@angular/router';
import { SummonerPage } from './features/summoner/summoner.component';
import { ChampionsComponent } from './features/summoner/champions/champions.component';
import { OverviewComponent } from './features/summoner/overview/overview.component';
import { SummonerStore } from './features/summoner/summoner.store';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomePage) },
    { 
        path: 'summoner/:region/:name/:tagLine', 
        component: SummonerPage,
        providers: [SummonerStore],
        children: [
            { path: '', component: OverviewComponent }, // if you keep overview inline
            { path: 'champions', component: ChampionsComponent },
        ],
    },
    { path: '**', redirectTo: '' },
];
