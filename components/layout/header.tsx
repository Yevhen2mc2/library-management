import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { User } from "@supabase/auth-js";

interface IProps {
  user: User | null;
}

export const Header = async ({ user }: IProps) => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-75"
          >
            <span className="text-2xl">📚</span>
            <span className="font-medium">Library</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-muted-foreground hidden text-sm sm:block">
                  {user.email}
                </span>
                <SignOutButton />
              </>
            ) : (
              <Link href={"/sign-in"}>
                <Button>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
