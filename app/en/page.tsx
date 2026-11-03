import { buildMetadata } from "@/lib/metadata";
import { LOGO_PATH } from "@/lib/constants";
import { HomeContent } from "@/components/home/HomeContent";

export const metadata = buildMetadata({
  title: "Futsal Club 21 Kragujevac – futsal and inclusion school",
  description:
    "The „21. October“ futsal club from Kragujevac is a registered sports club in the Ministry of Youth and Sports of the Republic of Serbia. Futsal school for children aged 5 to 14 and an inclusion programme.",
  path: "/en/",
  image: LOGO_PATH,
  lang: "en",
});

export default function EnglishHomePage() {
  return <HomeContent lang="en" />;
}
