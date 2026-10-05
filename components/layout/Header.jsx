"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/store/actions/authActions";
import { toggleSidebar } from "@/store/slices/themeSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";
import MobileSidebar from "./MobileSidebar";
import {
  Menu,
  Settings,
  LogOut,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  AlertTriangle,
} from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { sidebarCollapsed } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    setLogoutConfirmOpen(false);
    dispatch(logoutUser());
    router.push("/login");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <>
      <header className="sticky top-0 z-30 h-16 border-b bg-background/80 backdrop-blur-xl">
        <div className="flex h-full items-center gap-3 px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <button
            onClick={() => dispatch(toggleSidebar())}
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>

          <div className="flex-1" />

          <ThemeToggle />

          <div className="h-6 w-px bg-border" />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2.5 h-9 pl-1 pr-2 rounded-lg hover:bg-accent transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/40 data-[state=open]:bg-accent">
              <Avatar className="h-7 w-7 ring-2 ring-primary/20">
                <AvatarFallback className="gradient-primary text-white text-[11px] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-xs font-semibold">{user?.name || "Store Admin"}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  {user?.role === "admin" ? "Administrator" : "User"}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-1.5">
              <div className="px-2 py-2">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="gradient-primary text-white text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-none gap-1 min-w-0 flex-1">
                    <span className="text-sm font-semibold truncate">
                      {user?.name || "Store Admin"}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate">
                      {user?.email || "admin@storepos.com"}
                    </span>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSettings}
                className="text-xs font-medium cursor-pointer gap-2 py-2"
              >
                <Settings className="h-3.5 w-3.5" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogoutClick}
                className="text-xs font-medium cursor-pointer gap-2 py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader className="flex flex-col items-center text-center pt-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-base font-bold">Confirm Sign Out</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1 max-w-[280px]">
              Are you sure you want to log out of your session? You will need to sign in again to access the store inventory.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row items-center gap-2 mt-4 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLogoutConfirmOpen(false)}
              className="flex-1 h-10 text-xs font-semibold rounded-xl"
            >
              No, Keep Session
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmLogout}
              className="flex-1 h-10 text-xs font-semibold rounded-xl"
            >
              Yes, Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  );
}