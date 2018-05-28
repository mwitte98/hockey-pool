export interface ApiResponse {
  entries: Entry[];
  players: Player[];
  teams: Team[];
}

export interface Entry {
  id: number;
  name: string;
  player_ids: number[];
  players: Player[];
  points: number;
  pointsC: number;
  pointsW: number;
  pointsD: number;
  pointsG: number;
  totalGoals: number;
  tiebreaker: 'C' | 'W' | 'D' | 'G' | 'Goals' | 'Tied';
  rank: number;
  isDetailRow: boolean;
}

export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  team_id: number;
  team: Team;
  position: string;
  goals: number;
  assists: number;
  gwg: number;
  shg: number;
  otg: number;
  wins: number;
  shutouts: number;
  otl: number;
  points: number;
  finals_goals?: number;
  finals_assists?: number;
  finals_gwg?: number;
  finals_shg?: number;
  finals_otg?: number;
  finals_wins?: number;
  finals_shutouts?: number;
  finals_otl?: number;
}

export interface Team {
  id: number;
  name: string;
  abbr: string;
  is_eliminated: boolean;
  players: Player[];
  goalies: Player[];
}

export interface User {
  id: number;
  email: string;
}
