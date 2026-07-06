import type { FeedComment, FeedPost } from "@app-fitness/firebase";
import { useEffect, useState } from "react";

import { feedRepository } from "../../infra/container";
import { useSessionStore } from "../stores/sessionStore";

/** Realtime feed subscription (Firestore) — not a React Query hook since it pushes updates, not pulls them. */
export function useFeed(groupId: string) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = feedRepository.listenToFeed(groupId, (next) => {
      setPosts(next);
      setLoading(false);
    });
    return unsubscribe;
  }, [groupId]);

  return { posts, loading };
}

export function useComments(groupId: string, postId: string | null) {
  const [comments, setComments] = useState<FeedComment[]>([]);

  useEffect(() => {
    if (!postId) {
      setComments([]);
      return;
    }
    return feedRepository.listenToComments(groupId, postId, setComments);
  }, [groupId, postId]);

  return comments;
}

export function useToggleReaction(groupId: string) {
  const userId = useSessionStore((s) => s.user?.uid);
  return async (postId: string, emoji: string) => {
    if (!userId) return;
    await feedRepository.toggleReaction(groupId, postId, userId, emoji);
  };
}

export function useAddComment(groupId: string) {
  const userId = useSessionStore((s) => s.user?.uid);
  return async (postId: string, text: string) => {
    if (!userId || !text.trim()) return;
    await feedRepository.addComment(groupId, postId, userId, text.trim());
  };
}
