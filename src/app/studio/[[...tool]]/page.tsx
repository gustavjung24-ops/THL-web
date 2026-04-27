import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const runtime = "edge";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
