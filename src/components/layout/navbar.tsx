"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  BookOpen,
  Headphones,
  HandHeart,
  BarChart3,
  Target,
  Search,
  Settings,
  Menu,
  Heart,
  LogIn,
  Moon,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/quran", label: "Quran", icon: BookOpen },
  { href: "/recitation", label: "Listen", icon: Headphones },
  { href: "/duas", label: "Duas", icon: HandHeart },
  { href: "/hifz", label: "Memorize", icon: BarChart3 },
  { href: "/goals", label: "Goals", icon: Target },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg"
            : "bg-transparent"
        }`}
        id="main-nav"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            id="nav-logo"
          >
            <Moon className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">
              Quran<span className="text-primary">Project</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  id={`nav-${link.label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/search">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" id="nav-search">
                <Search className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10 gap-1.5"
              onClick={() => window.open("https://razorpay.me/@quranproject", "_blank")}
              id="nav-donate"
            >
              <Heart className="w-4 h-4" />
              Donate
            </Button>
            {authLoading ? (
              <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin ml-2" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-8 items-center gap-2 px-2 rounded-md hover:bg-primary/5 focus:outline-none transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || <UserIcon className="w-4 h-4" />}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    supabase.auth.signOut();
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-1.5" id="nav-login">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" id="mobile-menu-toggle" />}
              >
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-card border-border">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = pathname === link.href || pathname.startsWith(link.href + "/");
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          active
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {link.label}
                      </Link>
                    );
                  })}

                  <div className="h-px bg-border my-2" />

                  <Link
                    href="/search"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>

                  <div className="h-px bg-border my-2" />

                  <Button
                    variant="outline"
                    className="mx-4 gap-2 text-primary border-primary/30 hover:bg-primary/10"
                    onClick={() => window.open("https://razorpay.me/@quranproject", "_blank")}
                  >
                    <Heart className="w-4 h-4" />
                    Donate
                  </Button>

                  {authLoading ? (
                    <div className="mx-4 mt-1 flex justify-center py-2">
                      <div className="w-6 h-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    </div>
                  ) : user ? (
                    <Button 
                      variant="ghost" 
                      className="mx-4 mt-1 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => supabase.auth.signOut()}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out ({user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]})
                    </Button>
                  ) : (
                    <Link href="/login" className="mx-4 mt-1">
                      <Button variant="default" className="w-full gap-2">
                        <LogIn className="w-4 h-4" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Bottom Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border pb-[env(safe-area-inset-bottom)]"
           id="bottom-nav"
      >
        <div className="flex items-center justify-around px-2 py-1.5">
          {navLinks.slice(0, 5).map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
