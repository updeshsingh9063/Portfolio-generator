import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Building a portfolio requires an account. */
export default async function CreateLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/create");
  return <>{children}</>;
}
