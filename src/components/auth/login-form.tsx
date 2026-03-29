"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Moon,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleGoogleLogin() {
    setLoading("google");
    setError(null);
    setSuccessMsg(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }

    setLoading(null);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading("email");
    setError(null);
    setSuccessMsg(null);

    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all required fields.");
      setLoading(null);
      return;
    }

    if (mode === "signup") {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        if (data.session) {
          router.push("/");
          router.refresh();
        } else {
          setSuccessMsg("Check your email for the confirmation link!");
          setShowEmailForm(false);
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    }

    setLoading(null);
  }

  const isLoading = loading !== null;

  return (
    <div className="w-full max-w-md">
      {/* Main Card */}
      <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/5">
        {/* Decorative top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-gold-light to-primary/60" />

        {/* Geometric Pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 30deg, oklch(0.78 0.12 80 / 0.5) 30deg 60deg, transparent 60deg 90deg)`,
            backgroundSize: "60px 60px",
          }}
        />

        <CardContent className="relative z-10 pt-8 pb-8 px-6 sm:px-8">
          {/* Logo + Title */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
                <Moon className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {mode === "login" ? "Welcome Back" : "Join Quran Project"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Sign in to sync your progress across devices"
                : "Create an account to track streaks & memorization"}
            </p>
          </div>

          {successMsg && (
            <div className="mb-6 p-3 bg-emerald/10 border border-emerald/20 rounded-lg text-emerald text-sm text-center">
              {successMsg}
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="group relative w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-white text-gray-800 font-medium text-sm transition-all duration-200 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              id="login-google"
            >
              {loading === "google" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <GoogleIcon className="w-5 h-5" />
              )}
              <span>Continue with Google</span>
              <div className="absolute inset-0 rounded-xl ring-1 ring-black/10 group-hover:ring-black/20 transition-all" />
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">
              {showEmailForm ? "or use details" : "or continue with email"}
            </span>
          </div>

          {/* Email Toggle / Form */}
          {!showEmailForm ? (
            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
              id="login-email-toggle"
            >
              <Mail className="w-4 h-4" />
              <span>
                {mode === "login"
                  ? "Sign in with Email"
                  : "Sign up with Email"}
              </span>
            </button>
          ) : (
            <form
              onSubmit={handleEmailSubmit}
              className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {mode === "signup" && (
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Full Name"
                    className="pl-10 h-11 bg-background/50 border-border/60 focus:border-primary/50"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    id="signup-name"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  className="pl-10 h-11 bg-background/50 border-border/60 focus:border-primary/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  id="auth-email"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 pr-10 h-11 bg-background/50 border-border/60 focus:border-primary/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  id="auth-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 animate-in fade-in duration-200">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-11 gap-2 font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
                id="auth-submit"
              >
                {loading === "email" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Switch mode */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  className="text-primary font-semibold hover:underline underline-offset-2 transition-colors focus:outline-none"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  type="button"
                  id="switch-to-signup"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="text-primary font-semibold hover:underline underline-offset-2 transition-colors focus:outline-none"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  type="button"
                  id="switch-to-login"
                >
                  Sign In
                </button>
              </>
            )}
          </p>

          {/* Terms */}
          <p className="text-center text-[11px] text-muted-foreground/80 mt-4 leading-relaxed">
            By continuing, you agree to use this platform respectfully for
            Quranic purposes. We use secure authentication.
          </p>
        </CardContent>
      </Card>
      
      {/* Testimonial / Security badge below card */}
      <div className="mt-6 text-center text-xs text-muted-foreground/80 space-y-1">
         <p>🔒 Secured by Supabase</p>
         <p>Your authentication data is encrypted and safe.</p>
      </div>
    </div>
  );
}
