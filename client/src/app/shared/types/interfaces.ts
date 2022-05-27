import { FormGroup } from '@angular/forms';

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  goals?: number;
  assists?: number;
  gwg?: number;
  shg?: number;
  otg?: number;
  wins?: number;
  shutouts?: number;
  otl?: number;
  points?: number;
  finalsGoals?: number;
  finalsAssists?: number;
  finalsGwg?: number;
  finalsShg?: number;
  finalsOtg?: number;
  finalsWins?: number;
  finalsShutouts?: number;
  finalsOtl?: number;
}

export interface PlayerStatColumn {
  stat: string;
  header: string;
  colWidth: number;
  textWidth: number;
  finalsColWidthGtXs: number;
  finalsTextWidthGtXs: number;
}

export interface PlayerStatTiebreaker {
  attr: string;
  sortDirection: string;
  nestedAttr?: string;
}

export interface Setting {
  id: number;
  isPlayoffsStarted: boolean;
  minCenters: number;
  maxCenters: number;
  minWingers: number;
  maxWingers: number;
  minDefensemen: number;
  maxDefensemen: number;
  minGoalies: number;
  maxGoalies: number;
  pointsGoals: number;
  pointsAssists: number;
  pointsGwg: number;
  pointsShg: number;
  pointsOtg: number;
  pointsWins: number;
  pointsOtl: number;
  pointsShutouts: number;
  pointsFinalsGoals: number;
  pointsFinalsAssists: number;
  pointsFinalsGwg: number;
  pointsFinalsShg: number;
  pointsFinalsOtg: number;
  pointsFinalsWins: number;
  pointsFinalsOtl: number;
  pointsFinalsShutouts: number;
}

export interface User {
  id: number;
  email: string;
}

// START - /entries
export interface AdminEntry {
  id?: number;
  name: string;
  contestantName: string;
  email: string;
  playerIds: number[];
  form?: FormGroup;
  updateLoading?: boolean;
  updateSuccess?: boolean;
  updateFailure?: boolean;
}
// END - /entries

// START - /entries?field_groups=display
export interface DisplayEntry {
  name: string;
  playerIds: number[];
  bestEntry?: boolean;
  numCenter?: number;
  numWinger?: number;
  numDefenseman?: number;
  numGoalie?: number;
  points?: number;
  pointsC?: number;
  pointsW?: number;
  pointsD?: number;
  pointsG?: number;
  totalGoals?: number;
  tiebreaker?: number;
  rank?: number;
  isDetailRow?: boolean;
}
// END - /entries?field_groups=display

// START - /teams
export interface AdminTeam {
  id: number;
  name: string;
  abbr: string;
  isEliminated: boolean;
  madePlayoffs: boolean;
  inFinals?: boolean;
  conference: string;
  rank: number;
  nhlId: number;
  players: AdminPlayer[];
  form?: FormGroup;
  updateLoading?: boolean;
  updateSuccess?: boolean;
  updateFailure?: boolean;
}

export interface AdminPlayer {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  form?: FormGroup;
  updateLoading?: boolean;
  updateSuccess?: boolean;
  updateFailure?: boolean;
}
// END - /teams

// START - /teams?field_groups=home
export interface HomeTeam {
  id: number;
  name: string;
  abbr: string;
  isEliminated: boolean;
  nhlId: number;
  players: Player[];
}
// END - /teams?field_groups=home

// START - /teams?field_groups=player_stats
export interface PlayerStatsTeam {
  abbr: string;
  isEliminated: boolean;
  inFinals?: boolean;
  players: PlayerStatsPlayer[];
}

export interface PlayerStatsPlayer extends Player {
  isSelected?: boolean;
  team?: PlayerStatsTeam;
}
// END - /teams?field_groups=player_stats

// START - /teams?field_groups=upsert_entry
export interface UpsertEntryTeam {
  name: string;
  players: UpsertEntryPlayer[];
}

export interface UpsertEntryPlayer {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
}
// END - /teams?field_groups=upsert_entry
