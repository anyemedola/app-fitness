import type { Group, Member } from "../../domain/entities";
import type { GroupRepository } from "../../domain/repositories/GroupRepository";
import { GROUPS, MEMBERS } from "../local/groupsSeed";

/** See `data/local/groupsSeed.ts` — placeholder until a real groups/members API exists. */
export class LocalGroupRepository implements GroupRepository {
  async listGroups(): Promise<Group[]> {
    return GROUPS;
  }

  async listMembers(memberIds: string[]): Promise<Member[]> {
    return memberIds.map((id) => MEMBERS[id]).filter((m): m is Member => Boolean(m));
  }
}
