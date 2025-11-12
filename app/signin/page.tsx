"use client";

import { Button } from "@heroui/button";
import NextLink from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Sign In
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your trading journal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <NextLink
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </NextLink>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            color="primary"
            size="lg"
            className="w-full font-semibold"
          >
            Sign In
          </Button>
          <div className="text-center text-sm text-default-600">
            Don't have an account?{" "}
            <NextLink href="/signup" className="text-primary hover:underline font-semibold">
              Sign up
            </NextLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
