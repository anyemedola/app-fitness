export interface Member {
  id: string;
  name: string;
  initials: string;
  /** 0-360, drives the per-member avatar gradient — see `packages/ui`'s `hueToColor`. */
  hue: number;
  streak: number;
  points: number;
}
