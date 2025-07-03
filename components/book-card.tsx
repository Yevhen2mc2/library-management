"use client";

import { Book } from "@/types/book";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/auth-js";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface IProps {
  user: User | null;
  book: Book;
}

export const BookCard = ({ book, user }: IProps) => {
  const router = useRouter();

  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
    : null;

  const onRemove = async () => {
    try {
      const { error } = await supabase.from("books").delete().eq("id", book.id);
      if (error) {
        toast.error("Failed to delete the book");
        return;
      }
      toast.success("Book deleted successfully");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

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
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the book &#34;{book.title}&#34;.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose>
                    <Button variant={"destructive"} onClick={onRemove}>
                      Remove
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
