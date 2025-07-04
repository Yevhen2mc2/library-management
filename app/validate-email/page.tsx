"use client";

import { buttonVariants } from "@/components/ui/button";
import { useEffect } from "react";
import Link from "next/link";

export default function ValidateEmailPage() {
  useEffect(() => {
    // refresh auth status
    window.location.reload();
  }, []);

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
          <Link href={"/"} className={buttonVariants()}>
            Main page
          </Link>
        </div>
      </div>
    </div>
  );
}
