// app/workspace/page.tsx
import { redirect } from "next/navigation";

export default function WorkspaceRedirect() {
  redirect("/?tab=portal");
}
