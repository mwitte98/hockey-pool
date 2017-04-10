import { Player } from './player.model';

export class Entry {
  id: number;
  name: string;
  players: Player[];
  created_at: Date;
  updated_at: Date;
}
