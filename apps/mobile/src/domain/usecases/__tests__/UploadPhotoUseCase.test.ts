import { FakeChallengeRepository, FakePhotoStorageRepository } from "../../../__tests__/testUtils/fakeRepositories";
import { UploadPhotoUseCase } from "../UploadPhotoUseCase";

describe("UploadPhotoUseCase", () => {
  it("uploads the photo to storage, then reports the resulting URL to the challenge", async () => {
    const challenges = new FakeChallengeRepository();
    const photoStorage = new FakePhotoStorageRepository();
    photoStorage.urlToReturn = "https://storage.example/photos/lia/salada.jpg";
    const useCase = new UploadPhotoUseCase(challenges, photoStorage);

    const result = await useCase.execute("lia", "salada", "file:///tmp/photo.jpg");

    expect(photoStorage.lastUpload).toEqual({ userId: "lia", challengeId: "salada", localUri: "file:///tmp/photo.jpg" });
    expect(challenges.lastPhotoCall).toEqual({
      challengeId: "salada",
      photoUrl: "https://storage.example/photos/lia/salada.jpg",
    });
    expect(result.photoUrl).toBe("https://storage.example/photos/lia/salada.jpg");
  });
});
