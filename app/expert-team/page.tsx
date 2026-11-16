import { contentMetadata } from "@/components/ContentPage";
import { TeamPage } from "@/components/team/TeamPage";

export const metadata = contentMetadata("expert-team");

export default function Page() {
  return <TeamPage lang="en" />;
}
