import type { Challenge } from "../entities";
import type { ChallengeRepository, CreateChallengeInput } from "../repositories/ChallengeRepository";

/** Launches a new challenge in a group (e.g. "+ Novo" on the dashboard) and enrolls its creator. */
export class CreateChallengeUseCase {
  constructor(private readonly challenges: ChallengeRepository) {}

  async execute(input: CreateChallengeInput): Promise<Challenge> {
    if (!input.title.trim()) throw new Error("title is required");
    if (input.target <= 0) throw new Error("target must be a positive number");
    return this.challenges.create(input);
  }
}
