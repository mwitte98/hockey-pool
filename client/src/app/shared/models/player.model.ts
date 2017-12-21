import { Team } from './team.model';

export class Player {
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
