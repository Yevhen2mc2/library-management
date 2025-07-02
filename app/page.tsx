import { BookCard } from "@/components/book-card";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.from("books").select("*");

  return (
    <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
      {data?.map((book) => {
        return <BookCard book={book} key={book.id} />;
      })}
    </div>
  );
}
