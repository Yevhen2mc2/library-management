"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/lib/supabase/client";
import { Book, CreateBookInput, UpdateBookInput } from "@/types/book";
import { useRouter } from "next/navigation";
import { RemoveBookDialog } from "@/components/book/remove-book-dialog";

const schema = z.object({
  isbn: z.string().min(1, "ISBN is required").max(13, "ISBN must be 13 digits"),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  year: z.number(),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().optional(),
});

type BookForm = z.infer<typeof schema>;

interface Props {
  book?: Book;
}

export const BookFormPage = ({ book }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const isEdit = !!book;

  const form = useForm<BookForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      isbn: book?.isbn?.toString() || "",
      title: book?.title || "",
      author: book?.author || "",
      year: book?.year || new Date().getFullYear(),
      price: book?.price || 0,
      description: book?.description || "",
    },
  });

  const handleSubmit = async (data: BookForm) => {
    setIsSubmitting(true);

    try {
      if (isEdit) {
        // Update existing book
        const updateData: UpdateBookInput = {
          isbn: parseInt(data.isbn),
          title: data.title,
          author: data.author,
          year: data.year,
          price: data.price,
          description: data.description || null,
        };

        const { error } = await supabase
          .from("books")
          .update(updateData)
          .eq("id", book.id);

        if (error) throw error;

        toast.success("Book updated successfully");
      } else {
        // Create new book
        const insertData: CreateBookInput = {
          isbn: parseInt(data.isbn),
          title: data.title,
          author: data.author,
          year: data.year,
          price: data.price,
          description: data.description || null,
        };

        const { error } = await supabase.from("books").insert([insertData]);

        if (error) throw error;

        toast.success("Book created successfully");
      }

      router.push("/");
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error(isEdit ? "Failed to update book" : "Failed to create book");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              {isEdit ? "Edit Book" : "Add Book"}
            </h1>
          </div>

          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="isbn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ISBN</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 9780142437230"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseInt(e.target.value) ||
                                  new Date().getFullYear(),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter book title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter author name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="A brief description of the book..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-4">
                    {isEdit ? (
                      <RemoveBookDialog book={book}>
                        <Button variant="ghost" type="button">
                          Delete Book
                        </Button>
                      </RemoveBookDialog>
                    ) : null}

                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? isEdit
                          ? "Updating..."
                          : "Creating..."
                        : isEdit
                          ? "Save Changes"
                          : "Add Book"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
