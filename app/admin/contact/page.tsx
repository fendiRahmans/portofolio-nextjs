import { getContacts } from "@/actions/contact";
import ContactClient from "./ContactClient";

export default async function AdminContactPage() {
  const result = await getContacts();

  const contacts = result.success && result.data ? result.data : [];

  return <ContactClient initialContacts={contacts} />;
}
