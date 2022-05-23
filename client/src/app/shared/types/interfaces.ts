import { FormGroup } from '@angular/forms';

export interface Entry {
  id?: number;
  name: string;
  contestantName?: string;
  email?: string;
  playerIds: number[];
  players?: Player[];
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
  form?: FormGroup;
  updateLoading?: boolean;
  updateSuccess?: boolean;
  updateFailure?: boolean;
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  teamId: number;
  team: Team;
  position: string;
  isSelected?: boolean;
  goals: number;
  assists: number;
  gwg: number;
  shg: number;
  otg: number;
  wins: number;
  shutouts: number;
  otl: number;
  points: number;
  finalsGoals?: number;
  finalsAssists?: number;
  finalsGwg?: number;
  finalsShg?: number;
  finalsOtg?: number;
  finalsWins?: number;
  finalsShutouts?: number;
  finalsOtl?: number;
  form?: FormGroup;
  updateLoading?: boolean;
  updateSuccess?: boolean;
  updateFailure?: boolean;
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

export interface Team {
  id: number;
  name: string;
  abbr: string;
  isEliminated: boolean;
  madePlayoffs: boolean;
  inFinals?: boolean;
  conference: string;
  rank: number;
  nhlId: number;
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

// START - /entries?field_groups=display
export interface DisplayEntry {
  name: string;
  playerIds: number[];
}
// END - /entries?field_groups=display

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
