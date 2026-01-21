import { getTechStacks } from "@/actions/tech-stack";
import TechStackClient from "./TechStackClient";
import { TechStackItem } from "../../components/admin/TechStackFormDialog";

export default async function AdminTechStackPage() {
  const result = await getTechStacks();

  // Transform data to match TechStackItem with number id
  const techStackData: TechStackItem[] = result.success && result.data
    ? result.data.map(item => ({
      ...item,
      id: item.id // id is already number in data and TechStackItem
    }))
    : [];

  return <TechStackClient initialData={techStackData} />;
}
