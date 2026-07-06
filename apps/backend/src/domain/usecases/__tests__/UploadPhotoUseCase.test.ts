import { InMemoryChallengeRepository, InMemoryProgressRepository, makeChallenge } from "../../../__tests__/testUtils/inMemoryRepos";
import { UploadPhotoUseCase } from "../UploadPhotoUseCase";

describe("UploadPhotoUseCase", () => {
  const now = new Date("2027-06-10T12:00:00.000Z");

  function setup() {
    const progress = new InMemoryProgressRepository();
    const challenges = new InMemoryChallengeRepository(progress);
    const useCase = new UploadPhotoUseCase(challenges, progress);
    return { challenges, useCase };
  }

  it("marks the challenge complete and stores the photo URL", async () => {
    const { challenges, useCase } = setup();
    challenges.seed(makeChallenge({ id: "salada", kind: "PHOTO", target: 1, requirePhoto: true }));

    const entry = await useCase.execute({
      challengeId: "salada",
      userId: "lia",
      photoUrl: "https://storage.example/photos/lia/salada.jpg",
      now,
    });

    expect(entry.value).toBe(1);
    expect(entry.photoUrl).toBe("https://storage.example/photos/lia/salada.jpg");
    expect(entry.periodKey).toBe("2027-06-10");
  });

  it("rejects a missing photoUrl", async () => {
    const { challenges, useCase } = setup();
    challenges.seed(makeChallenge({ id: "salada", kind: "PHOTO", target: 1 }));
    await expect(
      useCase.execute({ challengeId: "salada", userId: "lia", photoUrl: "", now }),
    ).rejects.toThrow(/required/);
  });

  it("rejects non-PHOTO challenges", async () => {
    const { challenges, useCase } = setup();
    challenges.seed(makeChallenge({ id: "agua", kind: "WATER", target: 2 }));
    await expect(
      useCase.execute({ challengeId: "agua", userId: "lia", photoUrl: "https://x/y.jpg", now }),
    ).rejects.toThrow(/does not support/);
  });
});
