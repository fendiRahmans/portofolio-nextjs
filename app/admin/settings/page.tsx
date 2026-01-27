import { getSettings } from "@/actions/settings";
import SettingsClient from "./SettingsClient";
import { SettingItem } from "../../components/admin/SettingFormDialog";

export default async function AdminSettingsPage() {
  const result = await getSettings();

  console.log("AdminSettingsPage - getSettings result:", result);

  // Transform data to match SettingItem with number id
  const settingsData: SettingItem[] = result.success && result.data
    ? result.data.map(item => {
      console.log("Mapping setting item:", item);
      return {
        ...item,
        id: item.id // id is already number in data and SettingItem
      };
    })
    : [];

  console.log("AdminSettingsPage - final settingsData:", settingsData);

  return <SettingsClient initialData={settingsData} />;
}
