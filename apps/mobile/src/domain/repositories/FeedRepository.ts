import type { FeedComment, FeedPost } from "@app-fitness/firebase";

export interface FeedRepository {
  listenToFeed(groupId: string, callback: (posts: FeedPost[]) => void): () => void;
  listenToComments(groupId: string, postId: string, callback: (comments: FeedComment[]) => void): () => void;
  toggleReaction(groupId: string, postId: string, userId: string, emoji: string): Promise<void>;
  addComment(groupId: string, postId: string, authorId: string, text: string): Promise<string>;
  createPost(
    groupId: string,
    post: Omit<FeedPost, "id" | "groupId" | "createdAt" | "reactions">,
  ): Promise<string>;
}
