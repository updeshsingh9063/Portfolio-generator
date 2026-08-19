import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** The editor requires an account. */
export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/editor");
  return <>{children}</>;
}
