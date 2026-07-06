import { getFirebaseAuth } from "@app-fitness/firebase";

import {
  FirebaseAuthRepository,
  FirebasePhotoStorageRepository,
  FirestoreFeedRepository,
  HttpChallengeRepository,
  HttpStatsRepository,
  LocalGroupRepository,
} from "../data/repositories";
import {
  AutoCheckUseCase,
  CreateChallengeUseCase,
  GetDailyStatsUseCase,
  IncrementDailyProgressUseCase,
  MarkDailyCheckUseCase,
  RegisterWeeklyRepsUseCase,
  UploadPhotoUseCase,
} from "../domain/usecases";

import { ApiClient } from "./http/apiClient";

/**
 * Composition root: wires infra clients -> data repositories -> domain use-cases once, so
 * presentation hooks/screens only ever depend on the domain layer's interfaces/use-cases.
 * `getFirebaseAuth()` is only called lazily inside the token callback below, so this module
 * can be imported before `bootstrapFirebase()` runs without throwing.
 */
const apiClient = new ApiClient(process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000", async () => {
  const user = getFirebaseAuth().currentUser;
  return user ? user.getIdToken() : null;
});

export const challengeRepository = new HttpChallengeRepository(apiClient);
export const statsRepository = new HttpStatsRepository(apiClient);
export const authRepository = new FirebaseAuthRepository();
export const feedRepository = new FirestoreFeedRepository();
export const photoStorageRepository = new FirebasePhotoStorageRepository();
export const groupRepository = new LocalGroupRepository();

export const incrementDailyProgress = new IncrementDailyProgressUseCase(challengeRepository);
export const registerWeeklyReps = new RegisterWeeklyRepsUseCase(challengeRepository);
export const uploadPhoto = new UploadPhotoUseCase(challengeRepository, photoStorageRepository);
export const markDailyCheck = new MarkDailyCheckUseCase(challengeRepository);
export const autoCheck = new AutoCheckUseCase(challengeRepository);
export const getDailyStats = new GetDailyStatsUseCase(statsRepository);
export const createChallenge = new CreateChallengeUseCase(challengeRepository);
