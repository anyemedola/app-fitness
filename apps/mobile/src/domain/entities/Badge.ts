import type { IconName } from "@app-fitness/ui";

export interface Badge {
  id: string;
  icon: IconName;
  label: string;
  earned: boolean;
}
