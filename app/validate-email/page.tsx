"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ValidateEmailPage() {
  const router = useRouter();
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (!updated) {
      router.refresh();
      setUpdated(true);
    }
  }, [router, updated]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verified Successfully
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thanks for verification email
          </p>
        </div>
        <div className="text-center">
          <Button onClick={() => router.push("/")} className={buttonVariants()}>
            Main page
          </Button>
        </div>
      </div>
    </div>
  );
}
