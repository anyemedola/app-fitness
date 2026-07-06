import * as firebase from "@app-fitness/firebase";
import type { FeedComment, FeedPost } from "@app-fitness/firebase";

import type { FeedRepository } from "../../domain/repositories/FeedRepository";

/** Thin adapter over `packages/firebase`'s feedService, satisfying the domain's `FeedRepository` port. */
export class FirestoreFeedRepository implements FeedRepository {
  listenToFeed(groupId: string, callback: (posts: FeedPost[]) => void): () => void {
    return firebase.listenToFeed(groupId, callback);
  }

  listenToComments(groupId: string, postId: string, callback: (comments: FeedComment[]) => void): () => void {
    return firebase.listenToComments(groupId, postId, callback);
  }

  toggleReaction(groupId: string, postId: string, userId: string, emoji: string): Promise<void> {
    return firebase.toggleReaction(groupId, postId, userId, emoji);
  }

  addComment(groupId: string, postId: string, authorId: string, text: string): Promise<string> {
    return firebase.addComment(groupId, postId, authorId, text);
  }

  createPost(
    groupId: string,
    post: Omit<FeedPost, "id" | "groupId" | "createdAt" | "reactions">,
  ): Promise<string> {
    return firebase.createFeedPost(groupId, post);
  }
}
