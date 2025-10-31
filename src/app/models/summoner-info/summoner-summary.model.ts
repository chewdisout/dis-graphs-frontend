export interface RankEntry {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export interface MasteryTop {
  championId: number;
  championName: string;
  icon: string;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  tokensEarned: number;
}

export interface SummonerSummary {
  profile: {
    summoner_name: string;
    summoner_tag: string;
    region: string;
    profile_icon: number;
    summoner_level: number;
  } | null;

  ranks: RankEntry[];

  masteryTop: MasteryTop[];

  timestamps: {
    profileUpdatedAt: string;
    ranksUpdatedAt: string;
    masteryUpdatedAt: string;
    nextManualAllowedAt: string;
  };

  // FE Augmentations
  primaryRank?: RankEntry | null;
  secondaryRank?: RankEntry | null;
  loading?: boolean;
  error?: string;
}
