export interface SummonerMastery {
  championId: number;
  championName: string | null;
  icon: string | null;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  tokensEarned: number;
  chestGranted: boolean;
}