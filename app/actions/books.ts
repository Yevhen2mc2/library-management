"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { Book, CreateBookInput, UpdateBookInput } from "@/types/book";

const bookSchema = z.object({
  isbn: z.number().int().positive("ISBN must be a positive integer"),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  year: z
    .number()
    .int()
    .min(1000)
    .max(9999, "Year must be a valid 4-digit year"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().nullable().optional(),
});

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function createBook(
  input: CreateBookInput,
): Promise<ActionResult<Book>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "You must be signed in to create a book",
      };
    }

    const validationResult = bookSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues
        .map((e: { message: string }) => e.message)
        .join(", ");
      return {
        success: false,
        error: errorMessage,
      };
    }

    const { data, error } = await supabase
      .from("books")
      .insert([input])
      .select()
      .single();

    if (error) {
      console.error("Error creating book:", error);
      return {
        success: false,
        error: "Failed to create book. Please try again.",
      };
    }

    revalidatePath("/");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Unexpected error in createBook:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function updateBook(
  id: number,
  input: UpdateBookInput,
): Promise<ActionResult<Book>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "You must be signed in to update a book",
      };
    }

    const validationResult = bookSchema.partial().safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues
        .map((e: { message: string }) => e.message)
        .join(", ");
      return {
        success: false,
        error: errorMessage,
      };
    }

    const { data, error } = await supabase
      .from("books")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating book:", error);
      return {
        success: false,
        error: "Failed to update book. Please try again.",
      };
    }

    revalidatePath("/");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Unexpected error in updateBook:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function deleteBook(id: number): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "You must be signed in to delete a book",
      };
    }

    const { error } = await supabase.from("books").delete().eq("id", id);

    if (error) {
      console.error("Error deleting book:", error);
      return {
        success: false,
        error: "Failed to delete book. Please try again.",
      };
    }

    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error in deleteBook:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
