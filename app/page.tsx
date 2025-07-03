import { BookCard } from "@/components/book-card";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: books } = await supabase.from("books").select("*");

  return (
    <div className={"container mx-auto px-4 py-4"}>
      <div className={"mt-4 space-y-2"}>
        <h1>Library</h1>
        <p>{books?.length} books in the collection</p>
      </div>

      <div
        className={"mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"}
      >
        {books?.map((book) => {
          return <BookCard book={book} user={user} key={book.id} />;
        })}
      </div>
    </div>
  );
}
