import { FormArray, FormControl } from '@angular/forms';

export interface AdminPlayerForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  position: FormControl<string>;
}

export interface AdminTeamForm {
  name: FormControl<string>;
  abbr: FormControl<string>;
  isEliminated: FormControl<boolean>;
  madePlayoffs: FormControl<boolean>;
  conference: FormControl<string>;
  rank: FormControl<number>;
  nhlId: FormControl<number>;
}

export interface AuthForm {
  email: FormControl<string>;
  password: FormControl<string>;
  passwordConfirmation?: FormControl<string>;
}

export interface SettingForm {
  isPlayoffsStarted: FormControl<boolean>;
  minCenters: FormControl<number>;
  maxCenters: FormControl<number>;
  minWingers: FormControl<number>;
  maxWingers: FormControl<number>;
  minDefensemen: FormControl<number>;
  maxDefensemen: FormControl<number>;
  minGoalies: FormControl<number>;
  maxGoalies: FormControl<number>;
  pointsGoals: FormControl<number>;
  pointsAssists: FormControl<number>;
  pointsGwg: FormControl<number>;
  pointsShg: FormControl<number>;
  pointsOtg: FormControl<number>;
  pointsWins: FormControl<number>;
  pointsOtl: FormControl<number>;
  pointsShutouts: FormControl<number>;
  roundMultipliers: FormArray<FormControl<number>>;
}
