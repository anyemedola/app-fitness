export interface ProgressEntry {
  id: string;
  challengeId: string;
  userId: string;
  /** A day ("2027-06-10") for daily/streak/yesno challenges, or an ISO week ("2027-W23") for weekly ones. */
  periodKey: string;
  value: number;
  photoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
