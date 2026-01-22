import { getSettings } from "@/actions/settings";
import SettingsClient from "./SettingsClient";
import { SettingItem } from "../../components/admin/SettingFormDialog";

export default async function AdminSettingsPage() {
  const result = await getSettings();

  // Transform data to match SettingItem with number id
  const settingsData: SettingItem[] = result.success && result.data
    ? result.data.map(item => ({
      ...item,
      id: item.id // id is already number in data and SettingItem
    }))
    : [];

  return <SettingsClient initialData={settingsData} />;
}
