"use client";

import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(50),
});

type Form = z.infer<typeof schema>;

export const SignInForm = () => {
  const router = useRouter();

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: Form) {
    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (data.user) {
        toast.success("Signed in successfully");
        router.push("/");
        router.refresh();
      }

      if (error) {
        toast.error(error.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mb-4 text-4xl">📚</div>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder={"john@example.com"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type={"password"}
                      placeholder={"password"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className={"w-full"} type="submit">
              Sign In
            </Button>
          </form>
        </Form>

        <div className="text-muted-foreground mt-4 text-center text-sm">
          No account?{" "}
          <Link href={"/sign-up"} className="text-primary hover:underline">
            Sign Up
          </Link>
        </div>

        <div className="bg-muted mt-6 rounded-lg p-4">
          <p className="mb-2 text-sm">Demo credentials:</p>
          <p className="text-muted-foreground text-xs">
            Email: john@example.com
          </p>
          <p className="text-muted-foreground text-xs">Password: password</p>
        </div>
      </CardContent>
    </Card>
  );
};
