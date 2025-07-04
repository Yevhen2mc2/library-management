"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export const SignOutButton = () => {
  const router = useRouter();

  const handle = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Signed out successfully");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <Button variant="outline" onClick={handle}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  );
};
