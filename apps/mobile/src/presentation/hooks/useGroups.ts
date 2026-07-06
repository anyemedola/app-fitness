import { useQuery } from "@tanstack/react-query";

import { groupRepository } from "../../infra/container";
import { useSessionStore } from "../stores/sessionStore";

export function useGroups() {
  return useQuery({ queryKey: ["groups"], queryFn: () => groupRepository.listGroups() });
}

export function useActiveGroup() {
  const activeGroupId = useSessionStore((s) => s.activeGroupId);
  const { data: groups, ...rest } = useGroups();
  return { ...rest, group: groups?.find((g) => g.id === activeGroupId), groups };
}

export function useMembers(memberIds: string[]) {
  return useQuery({
    queryKey: ["members", ...memberIds],
    queryFn: () => groupRepository.listMembers(memberIds),
    enabled: memberIds.length > 0,
  });
}
