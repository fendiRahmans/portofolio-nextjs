import { getAbout } from "@/actions/about";
import AboutClient from "./AboutClient";
import { AboutSchema } from "@/lib/validations";

export default async function AdminAboutPage() {
  const result = await getAbout();
  const initialData = result.success ? (result.data as AboutSchema | null) : null;

  return <AboutClient initialData={initialData} />;
}
