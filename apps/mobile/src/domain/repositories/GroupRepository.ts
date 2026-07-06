import type { Group, Member } from "../entities";

export interface GroupRepository {
  listGroups(): Promise<Group[]>;
  listMembers(memberIds: string[]): Promise<Member[]>;
}
