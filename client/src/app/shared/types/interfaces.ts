import { FormControl, FormGroup, FormRecord } from '@angular/forms';

import { AdminPlayerForm, AdminTeamForm } from './forms';

export interface ChartLine {
  name: string;
  series: ChartPoint[];
}

export interface ChartPoint {
  name: Date;
  value: number;
}

export interface Player {
  id: string;
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
}

export interface PlayerStatColumn {
  stat: string;
  header: string;
}

export interface PlayerStatTiebreaker {
  attr: string;
  sortDirection: string;
  nestedAttr?: string;
}

export interface Setting {
  id?: number;
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
  roundMultipliers: number[];
}

export interface TelephoneNumber {
  area: string;
  exchange: string;
  subscriber: string;
}

export interface User {
  id: string;
  email: string;
}

// START - /entries
export interface AdminEntry {
  id?: number;
  name: string;
  contestantName: string;
  email: string;
  telephoneNumber: TelephoneNumber;
  playerIds: string[];
  form?: FormRecord<FormControl<TelephoneNumber | number | string>>;
  updateLoading?: boolean;
  updateSuccess?: boolean;
  updateFailure?: boolean;
}
// END - /entries

// START - /entries?field_groups=display
export interface EntryStats {
  points?: number;
  pointsD?: number;
  pointsG?: number;
  pointsC?: number;
  pointsW?: number;
  totalGoals?: number;
  tiebreaker?: number;
  rank?: number;
}

export interface DisplayEntry extends EntryStats {
  name: string;
  contestantName?: string;
  playerIds: string[];
  bestEntry?: boolean;
  numCenter?: number;
  numWinger?: number;
  numDefenseman?: number;
  numGoalie?: number;
  isDetailRow?: boolean;
  entryDates?: EntryDate[];
}

export interface EntryDate extends EntryStats {
  date: string;
}
// END - /entries?field_groups=display

// START - /teams
export interface AdminTeam {
  id?: number;
  name: string;
  abbr: string;
  isEliminated: boolean;
  madePlayoffs: boolean;
  conference: string;
  rank: number;
  players?: AdminPlayer[];
  form?: FormGroup<AdminTeamForm>;
  updateLoading?: boolean;
  updateSuccess?: boolean;
  updateFailure?: boolean;
}

export interface AdminPlayer {
  id?: number;
  firstName: string;
  lastName: string;
  position: string;
  form?: FormGroup<AdminPlayerForm>;
  updateLoading?: boolean;
  updateSuccess?: boolean;
  updateFailure?: boolean;
}
// END - /teams

// START - /teams?field_groups=home
export interface HomeTeam {
  name: string;
  abbr: string;
  isEliminated: boolean;
  players: HomePlayer[];
}

export interface HomePlayer {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  goals?: number;
  points: number;
}
// END - /teams?field_groups=home

// START - /teams?field_groups=player_stats
export interface PlayerStatsTeam {
  abbr: string;
  isEliminated: boolean;
  players: PlayerStatsPlayer[];
}

export interface PlayerStatsPlayer extends Player {
  isSelected?: boolean;
  team?: PlayerStatsTeam;
  stats?: PlayerStatsPlayerStat[];
}

export interface PlayerStatsPlayerStat {
  date: string;
  round: number;
  goals?: number;
  assists?: number;
  gwg?: number;
  shg?: number;
  otg?: number;
  wins?: number;
  shutouts?: number;
  otl?: number;
  points: number;
}
// END - /teams?field_groups=player_stats

// START - /teams?field_groups=upsert_entry
export interface UpsertEntryTeam {
  name: string;
  abbr: string;
  players: UpsertEntryPlayer[];
}

export interface UpsertEntryPlayer {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
}
// END - /teams?field_groups=upsert_entry

// START - /players?field_groups=historical
export interface HistoricalPlayer {
  id: string;
  position: string;
  stats: HistoricalStat[];
}

export interface HistoricalStat {
  date: string;
  goals?: number;
  points: number;
}
// END - /players?field_groups=historical
