"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Moon, Mail, Lock, User, ArrowRight } from "lucide-react";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Connect to auth backend
    alert(`${mode === "login" ? "Login" : "Signup"} functionality coming soon! For now, data is saved locally.`);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Moon className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">
          {mode === "login" ? "Welcome Back" : "Join Quran Project"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Sign in to sync your progress across devices"
            : "Create an account to track streaks & memorization"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Full Name"
                className="pl-9"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                id="signup-name"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              className="pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="auth-email"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password"
              className="pl-9"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="auth-password"
            />
          </div>

          <Button type="submit" className="w-full gap-2" id="auth-submit">
            {mode === "login" ? "Sign In" : "Create Account"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <Separator className="my-6" />

        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                className="text-primary font-medium hover:underline"
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-primary font-medium hover:underline"
                onClick={() => setMode("login")}
              >
                Sign In
              </button>
            </>
          )}
        </p>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By continuing, you agree to use this platform respectfully for
          Quranic purposes.
        </p>
      </CardContent>
    </Card>
  );
}
