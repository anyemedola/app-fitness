jest.mock("../config", () => ({
  getFirebaseStorage: jest.fn(() => ({ __fakeStorage: true })),
}));

jest.mock("firebase/storage", () => ({
  ref: jest.fn((_storage, path: string) => ({ path })),
  uploadBytes: jest.fn(async () => ({})),
  getDownloadURL: jest.fn(async (storageRef: { path: string }) => `https://storage.example/${storageRef.path}`),
}));

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { uploadChallengePhoto } from "../photoService";

describe("uploadChallengePhoto", () => {
  const fakeBlob = { size: 1234 };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({ blob: () => Promise.resolve(fakeBlob) }) as any;
  });

  it("fetches the local URI, uploads it, and returns the public URL", async () => {
    const url = await uploadChallengePhoto("lia", "salada", "file:///tmp/photo.jpg");

    expect(global.fetch).toHaveBeenCalledWith("file:///tmp/photo.jpg");
    expect(uploadBytes).toHaveBeenCalledWith(expect.objectContaining({ path: expect.stringContaining("photos/lia/salada/") }), fakeBlob, {
      contentType: "image/jpeg",
    });
    expect(getDownloadURL).toHaveBeenCalled();
    expect(url).toMatch(/^https:\/\/storage\.example\/photos\/lia\/salada\//);
  });

  it("builds a unique path per upload", async () => {
    await uploadChallengePhoto("lia", "salada", "file:///tmp/a.jpg");
    const firstPath = (ref as jest.Mock).mock.calls[0][1];
    await new Promise((resolve) => setTimeout(resolve, 2));
    await uploadChallengePhoto("lia", "salada", "file:///tmp/b.jpg");
    const secondPath = (ref as jest.Mock).mock.calls[1][1];
    expect(firstPath).not.toBe(secondPath);
  });
});
