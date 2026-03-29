"use client";

import Link from "next/link";
import { Heart, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 px-4 sm:px-6" id="site-footer">
      <div className="max-w-7xl mx-auto">
        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Moon className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold">
                Quran<span className="text-primary">Project</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An open-source platform to read, listen, memorize, and understand
              the Holy Quran.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 gap-1.5 text-primary border-primary/30 hover:bg-primary/10"
              onClick={() => window.open("https://razorpay.me/@quranproject", "_blank")}
            >
              <Heart className="w-4 h-4" />
              Support with Donation
            </Button>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-10 sm:gap-16">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider">
                Explore
              </h4>
              <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                <Link href="/quran" className="hover:text-primary transition-colors">Read Quran</Link>
                <Link href="/recitation" className="hover:text-primary transition-colors">Listen</Link>
                <Link href="/duas" className="hover:text-primary transition-colors">Duas & Athkar</Link>
                <Link href="/hifz" className="hover:text-primary transition-colors">Memorize</Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider">
                Resources
              </h4>
              <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                <Link href="/search" className="hover:text-primary transition-colors">Search</Link>
                <Link href="/goals" className="hover:text-primary transition-colors">Daily Goals</Link>
                <Link href="/settings" className="hover:text-primary transition-colors">Settings</Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider">
                Open Source
              </h4>
              <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                <a href="https://github.com/sarfarazalisyed/Quran-Project" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  GitHub
                </a>
                <a href="https://github.com/fherran/tadabur" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Tadabur Dataset
                </a>
                <a href="https://alquran.cloud" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Al Quran Cloud API
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          Made with ❤️ for the Ummah • Data from Al Quran Cloud API & Tadabur
        </div>
      </div>
    </footer>
  );
}
