"use client";

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
import { Button } from "@/components/ui/button";
import { Book } from "@/types/book";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { deleteBook } from "@/app/actions/books";

interface Props {
  book: Book;
  children: ReactNode;
}

export const RemoveBookDialog = ({ book, children }: Props) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (!book) return;

    try {
      const result = await deleteBook(book.id);

      if (!result.success) {
        toast.error(result.error || "Failed to delete book");
        return;
      }

      toast.success("Book deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the book
            &#34;
            {book?.title}
            &#34;.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
