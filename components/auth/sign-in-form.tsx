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

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(50),
});

type Form = z.infer<typeof schema>;

export const SignInForm = () => {
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: Form) {
    console.log(values);
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
