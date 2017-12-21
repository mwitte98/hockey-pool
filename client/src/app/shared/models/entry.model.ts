import { Player } from './player.model';

export class Entry {
  id: number;
  name: string;
  players: Player[];
  points = 0;
  pointsC = 0;
  pointsW = 0;
  pointsD = 0;
  pointsG = 0;
  totalGoals = 0;
  tiebreaker: 'C' | 'W' | 'D' | 'G' | 'Goals' | 'Tied';
  rank: number;

  constructor(id: number, name: string, players: Player[]) {
    this.id = id;
    this.name = name;
    this.players = players;
    this.calculatePoints();
  }

  equals(otherEntry: Entry): boolean {
    return this.points === otherEntry.points &&
      this.pointsC === otherEntry.pointsC &&
      this.pointsW === otherEntry.pointsW &&
      this.pointsD === otherEntry.pointsD &&
      this.pointsG === otherEntry.pointsG &&
      this.totalGoals === otherEntry.totalGoals;
  }

  compare(otherEntry: Entry): number {
    const pointsDiff = otherEntry.points - this.points;
    if (pointsDiff !== 0) { return pointsDiff; }

    this.setTiebreakerC();
    otherEntry.setTiebreakerC();

    const pointsDiffC = otherEntry.pointsC - this.pointsC;
    if (pointsDiffC !== 0) { return pointsDiffC; }

    this.setTiebreakerW();
    otherEntry.setTiebreakerW();

    const pointsDiffW = otherEntry.pointsW - this.pointsW;
    if (pointsDiffW !== 0) { return pointsDiffW; }

    this.setTiebreakerD();
    otherEntry.setTiebreakerD();

    const pointsDiffD = otherEntry.pointsD - this.pointsD;
    if (pointsDiffD !== 0) { return pointsDiffD; }

    this.setTiebreakerG();
    otherEntry.setTiebreakerG();

    const pointsDiffG = otherEntry.pointsG - this.pointsG;
    if (pointsDiffG !== 0) { return pointsDiffG; }

    this.setTiebreakerGoals();
    otherEntry.setTiebreakerGoals();

    if (otherEntry.totalGoals - this.totalGoals === 0) {
        this.tiebreaker = 'Tied';
        otherEntry.tiebreaker = 'Tied';
    }
    return otherEntry.totalGoals - this.totalGoals;
  }

  private calculatePoints() {
    this.players.forEach((player: Player) => {
        this.points += player.points;
        this.totalGoals += player.goals;
        if (player.position === 'Center') {
            this.pointsC += player.points;
        } else if (player.position === 'Winger') {
            this.pointsW += player.points;
        } else if (player.position === 'Defenseman') {
            this.pointsD += player.points;
        } else {
            this.pointsG += player.points;
        }
    });
  }

  private setTiebreakerC() {
    if (this.tiebreaker) { return; }
    this.tiebreaker = 'C';
  }

  private setTiebreakerW() {
    if (this.tiebreaker === 'C') { this.tiebreaker = 'W'; }
  }

  private setTiebreakerD() {
    if (this.tiebreaker === 'C' || this.tiebreaker === 'W') { this.tiebreaker = 'D'; }
  }

  private setTiebreakerG() {
    if (this.tiebreaker !== 'Goals' && this.tiebreaker !== 'Tied') { this.tiebreaker = 'G'; }
  }

  private setTiebreakerGoals() {
    if (this.tiebreaker !== 'Tied') { this.tiebreaker = 'Goals'; }
  }
}
