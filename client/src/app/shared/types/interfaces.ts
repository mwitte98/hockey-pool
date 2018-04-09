export interface Entry {
  id: number;
  name: string;
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
}

export interface Team {
  id: number;
  name: string;
  abbr: string;
  is_eliminated: boolean;
}

export interface User {
  id: number;
  email: string;
}
