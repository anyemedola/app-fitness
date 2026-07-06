import type { Challenge } from "../entities/Challenge";
import type { ChallengeRepository, CreateChallengeInput } from "../repositories/ChallengeRepository";

export class CreateChallengeUseCase {
  constructor(private readonly challenges: ChallengeRepository) {}

  async execute(input: CreateChallengeInput): Promise<Challenge> {
    if (!input.title.trim()) throw new Error("Dá um nome para o desafio.");
    if (input.target <= 0) throw new Error("A meta precisa ser maior que zero.");
    return this.challenges.create(input);
  }
}
