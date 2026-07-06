import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";

import { getFirestoreDb } from "./config";
import type { FeedComment, FeedPost } from "./types";

/**
 * Realtime social layer backed by Firestore: the group feed, per-post reactions, and
 * comments. Challenge definitions, progress, and stats are business data owned by the
 * Node/Prisma backend — this service intentionally only covers the social/realtime slice.
 */

function postsCollection(groupId: string) {
  return collection(getFirestoreDb(), "groups", groupId, "posts");
}

function reactionsCollection(groupId: string, postId: string) {
  return collection(getFirestoreDb(), "groups", groupId, "posts", postId, "reactions");
}

function commentsCollection(groupId: string, postId: string) {
  return collection(getFirestoreDb(), "groups", groupId, "posts", postId, "comments");
}

function toFeedPost(id: string, data: Record<string, unknown>): FeedPost {
  const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now();
  return {
    id,
    groupId: data.groupId as string,
    authorId: data.authorId as string,
    challengeId: (data.challengeId as string | null) ?? null,
    kind: data.kind as FeedPost["kind"],
    text: (data.text as string) ?? "",
    photoUrl: data.photoUrl as string | undefined,
    createdAt,
    reactions: (data.reactions as FeedPost["reactions"]) ?? {},
  };
}

/** Subscribes to a group's feed, newest first. Returns an unsubscribe function. */
export function listenToFeed(groupId: string, callback: (posts: FeedPost[]) => void): Unsubscribe {
  const q = query(postsCollection(groupId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => toFeedPost(d.id, d.data())));
  });
}

export async function createFeedPost(
  groupId: string,
  post: Omit<FeedPost, "id" | "groupId" | "createdAt" | "reactions">,
): Promise<string> {
  const ref = await addDoc(postsCollection(groupId), {
    ...post,
    groupId,
    reactions: {},
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Toggles the current user's reaction on a post: setting a new emoji replaces any
 * previous one from the same user, and re-tapping the same emoji removes it. The
 * aggregated `reactions` count on the post doc is kept consistent via a transaction.
 */
export async function toggleReaction(groupId: string, postId: string, userId: string, emoji: string): Promise<void> {
  const postRef = doc(getFirestoreDb(), "groups", groupId, "posts", postId);
  const reactionRef = doc(reactionsCollection(groupId, postId), userId);

  await runTransaction(getFirestoreDb(), async (tx) => {
    const [postSnap, reactionSnap] = await Promise.all([tx.get(postRef), tx.get(reactionRef)]);
    if (!postSnap.exists()) throw new Error(`Post ${postId} not found`);

    const counts: Record<string, number> = { ...(postSnap.data().reactions ?? {}) };
    const previousEmoji = reactionSnap.exists() ? (reactionSnap.data().emoji as string) : null;

    if (previousEmoji) {
      counts[previousEmoji] = Math.max(0, (counts[previousEmoji] ?? 1) - 1);
      if (counts[previousEmoji] === 0) delete counts[previousEmoji];
    }

    if (previousEmoji === emoji) {
      tx.delete(reactionRef);
    } else {
      counts[emoji] = (counts[emoji] ?? 0) + 1;
      tx.set(reactionRef, { emoji, updatedAt: serverTimestamp() });
    }

    tx.update(postRef, { reactions: counts });
  });
}

export async function removeReaction(groupId: string, postId: string, userId: string): Promise<void> {
  await deleteDoc(doc(reactionsCollection(groupId, postId), userId));
}

function toFeedComment(id: string, data: Record<string, unknown>): FeedComment {
  const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now();
  return {
    id,
    authorId: data.authorId as string,
    text: (data.text as string) ?? "",
    createdAt,
  };
}

/** Subscribes to a post's comments, oldest first. Returns an unsubscribe function. */
export function listenToComments(
  groupId: string,
  postId: string,
  callback: (comments: FeedComment[]) => void,
): Unsubscribe {
  const q = query(commentsCollection(groupId, postId), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => toFeedComment(d.id, d.data())));
  });
}

export async function addComment(groupId: string, postId: string, authorId: string, text: string): Promise<string> {
  const ref = await addDoc(commentsCollection(groupId, postId), {
    authorId,
    text,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Re-exported for services/tests that need to write a reaction doc directly. */
export async function setReactionDoc(
  groupId: string,
  postId: string,
  userId: string,
  emoji: string | null,
): Promise<void> {
  const ref = doc(reactionsCollection(groupId, postId), userId);
  if (emoji === null) {
    await deleteDoc(ref);
  } else {
    await setDoc(ref, { emoji, updatedAt: serverTimestamp() });
  }
}
