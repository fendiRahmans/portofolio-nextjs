import { getCareers } from "@/actions/career";
import CareerClient from "./CareerClient";
import { CareerItem, CareerColor } from "../../components/admin/CareerFormDialog";

export default async function AdminCareerPage() {
  const result = await getCareers();

  // Transform data to match CareerItem with string id
  const careerData: CareerItem[] = result.success && result.data
    ? result.data.map(item => ({
      ...item,
      id: item.id.toString(),
      color: item.color as CareerColor,
      techStack: item.techStack || undefined,
      keyProjects: item.keyProjects || undefined,
      projectList: item.projectList || undefined,
      bulletPoints: item.bulletPoints || undefined
    }))
    : [];

  return <CareerClient initialData={careerData} />;
}
