import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Quran Project account to track your reading streak, memorization progress, and daily goals.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0">
        {/* Radial glow */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] rounded-full bg-emerald/5 blur-[80px]" />

        {/* Geometric pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 30deg, oklch(0.78 0.12 80 / 0.4) 30deg 60deg, transparent 60deg 90deg)`,
            backgroundSize: "100px 100px",
            animation: "rotatePattern 300s linear infinite",
          }}
        />

        {/* Floating decorative elements */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/10"
            style={{
              left: `${10 + i * 25}%`,
              top: `${15 + (i % 2) * 50}%`,
              fontSize: `${0.6 + (i % 3) * 0.3}rem`,
              animation: `float ${7 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 1.2}s`,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <LoginForm />
      </div>
    </div>
  );
}
