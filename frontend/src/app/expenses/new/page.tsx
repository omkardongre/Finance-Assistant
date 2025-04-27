"use client"
import ExpenseForm from "../../../components/ExpenseForm";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NewExpensePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user?.id) setUserId(data.user.id);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!userId) return <div>Please log in to add an expense.</div>;

  return (
    <main className="p-6">
      <ExpenseForm userId={userId} />
    </main>
  );
}
