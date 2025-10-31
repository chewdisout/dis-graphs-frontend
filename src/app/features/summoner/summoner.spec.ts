import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonerPage } from './summoner.component';

describe('SummonerPage', () => {
  let component: SummonerPage;
  let fixture: ComponentFixture<SummonerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummonerPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummonerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
