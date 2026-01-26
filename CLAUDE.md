# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code (if needed)
npx prettier --write .
```

The development server runs on http://localhost:3000

## Project Overview

This is a **library management system** built with Next.js 15 and Supabase. The application allows users to browse books publicly, and authenticated users can add, edit, and delete books. The live application is deployed at https://library-management-ruby-nine.vercel.app.

**Tech Stack:**
- Next.js 15.5.7 with App Router and React 19
- Supabase for authentication and PostgreSQL database
- TypeScript for type safety
- Tailwind CSS v4 for styling
- React Hook Form + Zod for form validation
- Shadcn/ui components (Radix UI primitives)

## Architecture Patterns

### Server Components vs Client Components

This codebase follows Next.js 15 best practices with a **Server Components-first approach**:

**Server Components** (default):
- All page components (`app/page.tsx`, `app/(protected)/edit/[id]/page.tsx`, etc.)
- Layout components (`app/layout.tsx`, `components/layout/header.tsx`)
- These components fetch data directly from Supabase using `createClient()` from `lib/supabase/server.ts`
- Use `async/await` for data fetching at render time

**Client Components** (marked with `"use client"`):
- Forms with user interaction (`SignInForm`, `SignUpForm`, `BookFormPage`)
- Interactive UI components (`SignOutButton`, `BookCard`, `RemoveBookDialog`)
- Components using React hooks (`useState`, `useForm`, `useRouter`, etc.)
- These components use Supabase browser client from `lib/supabase/client.ts`

**Data Mutation Strategy:**
- This app uses **direct client-side Supabase calls** for mutations (create, update, delete)
- No Next.js Server Actions are used
- After mutations, use `router.refresh()` to revalidate Server Component data

### Authentication Flow

Authentication is handled by **Supabase Auth** with cookie-based sessions:

1. **Middleware** (`middleware.ts` and `lib/supabase/middleware.ts`):
   - Runs on every request to validate and refresh the user session
   - **CRITICAL**: Must call `supabase.auth.getUser()` before any routing logic
   - Redirects unauthenticated users trying to access protected routes to `/sign-in`
   - Redirects authenticated users away from `/sign-in` and `/sign-up` to `/`
   - Handles email verification by detecting `code` query parameter and redirecting to `/validate-email`
   - Public pages: `/`, `/sign-in`, `/sign-up`, `/validate-email`

2. **Server-side Auth** (`lib/supabase/server.ts`):
   - Creates a Supabase client that reads/writes session cookies
   - Used in Server Components to check authentication status
   - The `setAll` method gracefully handles errors during Server Component renders (expected behavior)

3. **Client-side Auth** (`lib/supabase/client.ts`):
   - Creates a browser-based Supabase client
   - Used for sign-in, sign-up, and sign-out operations
   - After sign-out, always call `router.refresh()` to sync server state

4. **Email Verification**:
   - Supabase sends a confirmation email with a `code` parameter
   - Middleware intercepts requests to `/` with `code` parameter and redirects to `/validate-email`
   - The `validate-email` page exchanges the code for a session using `supabase.auth.exchangeCodeForSession()`
   - After successful verification, users are redirected to home and `router.refresh()` is called to update auth state

### Database Schema and Types

The database has a single table: **books**

```typescript
books {
  id: number (primary key, auto-generated)
  isbn: number (required)
  title: string (required)
  author: string (required)
  year: number (required)
  price: number (required)
  description: string | null (optional)
  created_at: string (auto-generated timestamp)
}
```

**Type Generation:**
- Database types are auto-generated in `database.types.ts` by Supabase CLI
- Application types in `types/book.ts` are derived from `database.types.ts`:
  - `Book` - Complete row type
  - `CreateBookInput` - For INSERT operations (omits id and created_at)
  - `UpdateBookInput` - For UPDATE operations (all fields optional)

**To regenerate types after schema changes:**
```bash
npx supabase gen types typescript --project-id <your-project-id> > database.types.ts
```

### Form Handling Pattern

All forms follow this pattern:

1. **Schema Definition** with Zod:
```typescript
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  year: z.number(),
  price: z.number().min(0, "Price must be positive"),
  // ...
});
```

2. **React Hook Form Setup**:
```typescript
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: { /* ... */ },
});
```

3. **Submission Handler**:
```typescript
const onSubmit = async (data: z.infer<typeof schema>) => {
  setLoading(true);
  try {
    const { error } = await supabase.from("books").insert(data);
    if (error) throw error;
    toast.success("Success!");
    router.push("/");
    router.refresh(); // Revalidate server data
  } catch (error) {
    toast.error((error as Error).message);
  } finally {
    setLoading(false);
  }
};
```

4. **Form Rendering** with Shadcn components:
```typescript
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### Routing Structure

```
/                           # Home page (books listing, public)
/sign-in                    # Sign in page (public)
/sign-up                    # Sign up page (public)
/validate-email             # Email verification success page (public)
/new                        # Add new book (protected)
/edit/[id]                  # Edit book by ID (protected)
/api/supabase-request       # API route for health checks
```

**Route Groups:**
- `(protected)` - Logical grouping for protected pages (doesn't affect URLs)
- Route protection is enforced by middleware, not per-route logic

**Dynamic Routes:**
- Next.js 15 requires treating `params` as a Promise in dynamic routes
- Example: `const params = await props.params; const id = params.id;`

## Component Organization

```
components/
├── ui/              # Shadcn/ui base components (Button, Input, Card, Dialog, etc.)
├── auth/            # Authentication forms (SignInForm, SignUpForm)
├── book/            # Book-specific components (BookFormPage, RemoveBookDialog)
└── layout/          # Layout components (Header, SignOutButton)
```

**Shadcn/ui Components:**
- Configuration in `components.json` (New York style, CSS variables)
- Use `cn()` utility from `lib/utils.ts` to merge Tailwind classes
- Components are built on Radix UI primitives
- Customization via Tailwind CSS classes and CSS variables

## Important Implementation Notes

### Middleware Best Practices

When modifying `lib/supabase/middleware.ts`, follow these rules:

1. **Never remove `supabase.auth.getUser()`** - This is required for session management
2. **Don't add code between `createServerClient` and `auth.getUser()`** - This can cause random logouts
3. **Always return the `supabaseResponse` object** - Modifying cookies incorrectly will break sessions
4. If creating a new response, copy cookies from `supabaseResponse`

### Working with Supabase

**Server Components:**
```typescript
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: books } = await supabase.from("books").select("*");
  // ...
}
```

**Client Components:**
```typescript
"use client";
import { createClient } from "@/lib/supabase/client";

export default function Component() {
  const supabase = createClient();
  // Use for mutations, auth operations, etc.
}
```

### Image Optimization

The app uses **Next.js Image component** with Open Library API for book covers:

```typescript
<Image
  src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
  alt={book.title}
  width={200}
  height={300}
/>
```

The domain `covers.openlibrary.org` is configured in `next.config.ts` under `images.remotePatterns`.

### Environment Variables

Required environment variables (defined in `env.d.ts`):

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

These are prefixed with `NEXT_PUBLIC_` because they're used in both server and client components.

## Common Patterns

### Adding a New Protected Page

1. Create page in `app/(protected)/your-route/page.tsx`
2. No additional middleware configuration needed (automatically protected)
3. Fetch user data in Server Component:
```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/sign-in"); // Extra safety check
```

### Creating a New Form

1. Define Zod schema for validation
2. Create Client Component with `"use client"`
3. Use React Hook Form with `zodResolver`
4. Wrap fields in Shadcn `<Form>` components
5. Handle submission with Supabase client
6. Show feedback with `toast.success()` or `toast.error()`
7. Navigate with `router.push()` and refresh with `router.refresh()`

### Querying the Database

**Fetch all records:**
```typescript
const { data, error } = await supabase.from("books").select("*");
```

**Fetch by ID:**
```typescript
const { data, error } = await supabase
  .from("books")
  .select("*")
  .eq("id", id)
  .single();
```

**Insert:**
```typescript
const { data, error } = await supabase.from("books").insert(bookData);
```

**Update:**
```typescript
const { data, error } = await supabase
  .from("books")
  .update(bookData)
  .eq("id", id);
```

**Delete:**
```typescript
const { data, error } = await supabase.from("books").delete().eq("id", id);
```

## Code Style

- Use Prettier with `prettier-plugin-tailwindcss` for consistent formatting
- TypeScript strict mode is enabled
- Prefer `const` over `let`
- Use async/await over promises
- Always handle errors in try/catch blocks
- Show user-friendly error messages via toast notifications
