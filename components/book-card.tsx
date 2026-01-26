"use client";

import { Book } from "@/types/book";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/auth-js";
import { RemoveBookDialog } from "@/components/book/remove-book-dialog";
import { BookDrawer } from "@/components/book/book-drawer";

interface Props {
  user: User | null;
  book: Book;
}

export const BookCard = ({ book, user }: Props) => {
  const router = useRouter();

  const coverUrlSmall = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
    : null;

  return (
    <div className="relative">
      <BookDrawer book={book}>
        <Card className="cursor-pointer transition-shadow duration-200 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="mx-auto mb-4 aspect-square w-40 overflow-hidden rounded-lg bg-gray-100">
              <Image
                width={160}
                height={160}
                src={coverUrlSmall || ""}
                alt={`Cover of ${book.title}`}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <h3 className="line-clamp-2">{book.title}</h3>
              <p className="text-muted-foreground">{book.author}</p>
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <span>{book.year}</span>
                <span>${book.price.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </BookDrawer>

      {!!user && (
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/edit/${book.id}`);
            }}
          >
            <Edit className="size-4" />
          </Button>
          <RemoveBookDialog book={book}>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="size-4" />
            </Button>
          </RemoveBookDialog>
        </div>
      )}
    </div>
  );
};
