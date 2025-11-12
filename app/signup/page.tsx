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

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Start your journey to better trading today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="John Doe" required />
          </div>
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="text-xs text-default-600">
            By creating an account, you agree to our{" "}
            <NextLink href="/terms" className="text-primary hover:underline">
              Terms of Service
            </NextLink>{" "}
            and{" "}
            <NextLink href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </NextLink>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button color="primary" size="lg" className="w-full font-semibold">
            Create Account
          </Button>
          <div className="text-center text-sm text-default-600">
            Already have an account?{" "}
            <NextLink
              href="/signin"
              className="text-primary hover:underline font-semibold"
            >
              Sign in
            </NextLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
