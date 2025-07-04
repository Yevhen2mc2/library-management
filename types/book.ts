import { Database } from "@/database.types";

export type Book = Database["public"]["Tables"]["books"]["Row"];
export type UpdateBookInput = Database["public"]["Tables"]["books"]["Update"];
export type CreateBookInput = Database["public"]["Tables"]["books"]["Insert"];
