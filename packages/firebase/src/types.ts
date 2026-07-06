export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
}

export interface FeedReactionMap {
  [emoji: string]: number;
}

export interface FeedPost {
  id: string;
  groupId: string;
  authorId: string;
  challengeId: string | null;
  kind: "water" | "photo" | "count" | "streak" | "yesno" | "join";
  text: string;
  photoUrl?: string;
  createdAt: number;
  reactions: FeedReactionMap;
}

export interface FeedComment {
  id: string;
  authorId: string;
  text: string;
  createdAt: number;
}
