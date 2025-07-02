namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_API_KEY: string; // this is safe to use in browser because RLS protect enable
  }
}
