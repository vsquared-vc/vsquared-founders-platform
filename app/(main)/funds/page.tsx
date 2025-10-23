import { FundList } from '@/components/fund-list'
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FundsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <FundList />
    </div>
  )
}
