import "server-only";
import {
  defaultMissionContent,
  type MissionContent,
} from "@/features/about/data/mission-content";
import { sanityClient } from "./client";
import { missionPageQuery } from "./queries";

export async function getMissionContent(): Promise<MissionContent> {
  const content = await sanityClient.fetch<MissionContent | null>(
    missionPageQuery,
    {},
    { next: { revalidate: 60 } },
  );
  if (
    !content ||
    content.objectives.length !== 4 ||
    content.objectives.some(
      (objective) =>
        !objective.title?.trim() ||
        objective.points.length === 0 ||
        objective.points.some((point) => !point.trim()),
    )
  )
    return defaultMissionContent;
  return content;
}
