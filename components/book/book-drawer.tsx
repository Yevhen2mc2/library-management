"use client";

import { Book } from "@/types/book";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ReactNode } from "react";

interface BookDrawerProps {
  book: Book;
  children: ReactNode;
}

export const BookDrawer = ({ book, children }: BookDrawerProps) => {
  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : null;

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent>
        <div className="h-full overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{book.title}</DrawerTitle>
            <DrawerDescription>by {book.author}</DrawerDescription>
          </DrawerHeader>

          <div className="space-y-6 p-4">
            {coverUrl && (
              <div className="mx-auto w-full max-w-sm">
                <AspectRatio ratio={2 / 3}>
                  <Image
                    src={coverUrl}
                    alt={`Cover of ${book.title}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                </AspectRatio>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                  Author
                </h4>
                <p>{book.author}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                    Year
                  </h4>
                  <p>{book.year}</p>
                </div>

                <div>
                  <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                    Price
                  </h4>
                  <p>${book.price.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                  ISBN
                </h4>
                <p>{book.isbn}</p>
              </div>

              {book.description && (
                <div>
                  <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                    Description
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {book.description}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                  Added on
                </h4>
                <p className="text-muted-foreground text-sm">
                  {new Date(book.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
