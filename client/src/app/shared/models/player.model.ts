import { Team } from './team.model';

export class Player {
  id: number;
  first_name: string;
  last_name: string;
  nhlID: number;
  team_id: number;
  team: Team;
  position: string;
  goals: number;
  assists: number;
  gwg: number;
  shg: number;
  wins: number;
  shutouts: number;
  otl: number;
  points: number;
  created_at: Date;
  updated_at: Date;
}
