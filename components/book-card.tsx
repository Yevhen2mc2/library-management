"use client";

import { Book } from "@/types/book";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/auth-js";
import { RemoveBookDialog } from "@/components/book/remove-book-dialog";

interface IProps {
  user: User | null;
  book: Book;
}

export const BookCard = ({ book, user }: IProps) => {
  const router = useRouter();

  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
    : null;

  return (
    <Card className="group transition-shadow duration-200 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="mx-auto mb-4 aspect-square w-40 overflow-hidden rounded-lg bg-gray-100">
          <Image
            width={160}
            height={160}
            src={coverUrl || ""}
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

        {!!user && (
          <div className="mt-4 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/edit/${book.id}`)}
              className="flex-1"
            >
              <Edit />
              Edit
            </Button>
            <RemoveBookDialog book={book}>
              <Button variant="outline" size="sm" className="flex-1">
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </RemoveBookDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
