import { BookFormPage } from "@/components/book/book-form";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface EditBookPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;

  const bookId = parseInt(id, 10);
  if (isNaN(bookId)) notFound();

  const supabase = await createClient();

  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", bookId)
    .single();

  if (error || !book) notFound();

  return (
    <div>
      <BookFormPage book={book} />
    </div>
  );
}
