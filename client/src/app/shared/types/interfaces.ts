import { FormGroup } from '@angular/forms';

export interface ApiResponse {
  entries: Entry[];
  players: Player[];
  teams: Team[];
}

export interface Entry {
  id: number;
  name: string;
  contestant_name: string;
  email: string;
  player_ids: number[];
  players: Player[];
  points: number;
  pointsC: number;
  pointsW: number;
  pointsD: number;
  pointsG: number;
  totalGoals: number;
  tiebreaker: number;
  rank: number;
  isDetailRow: boolean;
  form?: FormGroup;
  updateLoading?: boolean;
  updateSuccess?: boolean;
  updateFailure?: boolean;
}

export interface EntryRequest {
  entry: {
    name: string;
    contestant_name: string;
    email: string;
    player_ids: number[];
  };
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
  form?: FormGroup;
  updateLoading?: boolean;
  updateSuccess?: boolean;
  updateFailure?: boolean;
}

export interface Setting {
  id: number;
  is_playoffs_started: boolean;
  min_centers: number;
  max_centers: number;
  min_wingers: number;
  max_wingers: number;
  min_defensemen: number;
  max_defensemen: number;
  min_goalies: number;
  max_goalies: number;
  points_goals: number;
  points_assists: number;
  points_gwg: number;
  points_shg: number;
  points_otg: number;
  points_wins: number;
  points_otl: number;
  points_shutouts: number;
  points_finals_goals: number;
  points_finals_assists: number;
  points_finals_gwg: number;
  points_finals_shg: number;
  points_finals_otg: number;
  points_finals_wins: number;
  points_finals_otl: number;
  points_finals_shutouts: number;
}

export interface Team {
  id: number;
  name: string;
  abbr: string;
  is_eliminated: boolean;
  players: Player[];
  goalies: Player[];
  form?: FormGroup;
  updateLoading?: boolean;
  updateSuccess?: boolean;
  updateFailure?: boolean;
}

export interface User {
  id: number;
  email: string;
}
