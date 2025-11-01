export interface MatchLive {
  inGame: boolean;
  gameId?: number;
  gameStartTime?: number;
  gameLength?: number;
  platform?: string;

  bans?: {
    blue: Array<{ championId: number; pickTurn: number; icon: string }>;
    red: Array<{ championId: number; pickTurn: number; icon: string }>;
  };

  participants?: Array<{
    team: "BLUE" | "RED";
    summonerName: string;
    puuid: string;
    championId: number;
    championName: string;
    championIcon: string;
    spell1Id: number;
    spell2Id: number;
    profileIconId: number;
    bot: boolean;
    summonerLevel: number;
  }>;
}
