import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

interface IProps {
  user?: unknown;
}

export const Header = ({ user }: IProps) => {
  const handleSignOut = () => {
    console.log("TODO sign out");
  };

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
                <span className="text-muted-foreground text-sm">
                  Welcome, TODO
                </span>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
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
