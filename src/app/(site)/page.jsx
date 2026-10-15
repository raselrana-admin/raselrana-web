import HomeView from "@/views/home/HomeView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Rasel Rana — Manager (Technical), BTCL",
  description:
    "Personal site of Rasel Rana — telecommunications and electrical/electronic engineering, BTCL.",
  path: "/",
});

export default function HomePage() {
  return <HomeView />;
}
