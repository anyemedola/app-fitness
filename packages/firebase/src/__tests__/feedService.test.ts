const mockTxGet = jest.fn();
const mockTxSet = jest.fn();
const mockTxUpdate = jest.fn();
const mockTxDelete = jest.fn();

jest.mock("../config", () => ({
  getFirestoreDb: jest.fn(() => ({ __fakeDb: true })),
}));

jest.mock("firebase/firestore", () => {
  class Timestamp {
    constructor(private millis: number) {}
    toMillis() {
      return this.millis;
    }
  }
  return {
    collection: jest.fn((_db, ...segments: string[]) => ({ path: segments.join("/") })),
    doc: jest.fn((parent: { path?: string }, id?: string) => ({
      path: id ? `${parent.path}/${id}` : String(parent),
    })),
    addDoc: jest.fn(async (_ref, data) => ({ id: "new-doc-id", data })),
    setDoc: jest.fn(async () => undefined),
    deleteDoc: jest.fn(async () => undefined),
    onSnapshot: jest.fn(),
    orderBy: jest.fn((field: string, direction: string) => ({ field, direction })),
    query: jest.fn((ref, ...clauses) => ({ ref, clauses })),
    serverTimestamp: jest.fn(() => "SERVER_TIMESTAMP"),
    runTransaction: jest.fn(async (_db, updateFn) => {
      const tx = { get: mockTxGet, set: mockTxSet, update: mockTxUpdate, delete: mockTxDelete };
      return updateFn(tx);
    }),
    Timestamp,
  };
});

import { addDoc, onSnapshot, runTransaction } from "firebase/firestore";

import { addComment, createFeedPost, listenToFeed, toggleReaction } from "../feedService";

describe("createFeedPost", () => {
  it("writes the post with empty reactions and a server timestamp", async () => {
    await createFeedPost("suor", { authorId: "lia", challengeId: "agua", kind: "water", text: "Bati 1L!" });

    expect(addDoc).toHaveBeenCalledWith(
      expect.objectContaining({ path: "groups/suor/posts" }),
      expect.objectContaining({
        authorId: "lia",
        groupId: "suor",
        reactions: {},
        createdAt: "SERVER_TIMESTAMP",
      }),
    );
  });
});

describe("listenToFeed", () => {
  it("maps snapshot docs into FeedPost objects", () => {
    const callback = jest.fn();
    (onSnapshot as jest.Mock).mockImplementation((_query, onNext) => {
      onNext({
        docs: [
          {
            id: "f1",
            data: () => ({ groupId: "suor", authorId: "marina", challengeId: "salada", kind: "photo", text: "Salada!", reactions: { "🔥": 2 } }),
          },
        ],
      });
      return () => {};
    });

    listenToFeed("suor", callback);

    expect(callback).toHaveBeenCalledWith([
      expect.objectContaining({ id: "f1", authorId: "marina", kind: "photo", reactions: { "🔥": 2 } }),
    ]);
  });
});

describe("toggleReaction", () => {
  beforeEach(() => jest.clearAllMocks());

  it("adds a first-time reaction", async () => {
    mockTxGet
      .mockResolvedValueOnce({ exists: () => true, data: () => ({ reactions: {} }) })
      .mockResolvedValueOnce({ exists: () => false, data: () => ({}) });

    await toggleReaction("suor", "f1", "lia", "🔥");

    expect(mockTxSet).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ emoji: "🔥" }));
    expect(mockTxUpdate).toHaveBeenCalledWith(expect.anything(), { reactions: { "🔥": 1 } });
    expect(mockTxDelete).not.toHaveBeenCalled();
  });

  it("replaces a previous reaction with a new one", async () => {
    mockTxGet
      .mockResolvedValueOnce({ exists: () => true, data: () => ({ reactions: { "🔥": 1 } }) })
      .mockResolvedValueOnce({ exists: () => true, data: () => ({ emoji: "🔥" }) });

    await toggleReaction("suor", "f1", "lia", "💪");

    expect(mockTxUpdate).toHaveBeenCalledWith(expect.anything(), { reactions: { "💪": 1 } });
  });

  it("removes the reaction when tapping the same emoji again", async () => {
    mockTxGet
      .mockResolvedValueOnce({ exists: () => true, data: () => ({ reactions: { "🔥": 1 } }) })
      .mockResolvedValueOnce({ exists: () => true, data: () => ({ emoji: "🔥" }) });

    await toggleReaction("suor", "f1", "lia", "🔥");

    expect(mockTxDelete).toHaveBeenCalled();
    expect(mockTxUpdate).toHaveBeenCalledWith(expect.anything(), { reactions: {} });
  });

  it("throws when the post does not exist", async () => {
    mockTxGet
      .mockResolvedValueOnce({ exists: () => false, data: () => ({}) })
      .mockResolvedValueOnce({ exists: () => false, data: () => ({}) });

    await expect(toggleReaction("suor", "missing", "lia", "🔥")).rejects.toThrow(/not found/);
  });
});

describe("addComment", () => {
  it("writes the comment with a server timestamp", async () => {
    await addComment("suor", "f1", "lia", "Bora!");
    expect(addDoc).toHaveBeenCalledWith(
      expect.objectContaining({ path: "groups/suor/posts/f1/comments" }),
      expect.objectContaining({ authorId: "lia", text: "Bora!", createdAt: "SERVER_TIMESTAMP" }),
    );
  });
});

describe("runTransaction wiring", () => {
  it("is invoked once per toggleReaction call", async () => {
    jest.clearAllMocks();
    mockTxGet
      .mockResolvedValueOnce({ exists: () => true, data: () => ({ reactions: {} }) })
      .mockResolvedValueOnce({ exists: () => false, data: () => ({}) });
    await toggleReaction("suor", "f1", "lia", "🔥");
    expect(runTransaction).toHaveBeenCalledTimes(1);
  });
});
