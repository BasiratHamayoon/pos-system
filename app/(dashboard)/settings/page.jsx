"use client";

import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, updatePassword as updatePasswordAction } from "@/store/actions/authActions";
import { debounce } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Store,
  Save,
  CheckCircle2,
  User,
  Shield,
  AlertCircle,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const settingsTabs = [
  { id: "store", label: "Store & Profile Info", icon: Store, desc: "Business & Admin details" },
  { id: "security", label: "Security", icon: Shield, desc: "Password & access" },
];

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState("store");
  
  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    storeName: "",
    storeAddress: "",
    storePhone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setStoreForm({
        name: user.name || "",
        email: user.email || "",
        storeName: user.storeName || "",
        storeAddress: user.storeAddress || "",
        storePhone: user.storePhone || "",
      });
    }
  }, [user]);

  const showMessage = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: "", message: "" }), 3000);
  };

  const processProfileSubmit = async (data) => {
    setIsLoading(true);
    try {
      await dispatch(updateProfile(data));
      showMessage("success", "Profile updated successfully!");
    } catch (err) {
      showMessage("error", err || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const processPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      showMessage("error", "New passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await updatePasswordAction({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });
      showMessage("success", "Password updated successfully!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showMessage("error", err || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedProfileSubmit = useCallback(debounce((d) => processProfileSubmit(d), 500), [dispatch]);
  const debouncedPasswordSubmit = useCallback(debounce((d) => processPasswordSubmit(d), 500), []);

  const handleSaveStore = (e) => {
    e.preventDefault();
    debouncedProfileSubmit(storeForm);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    debouncedPasswordSubmit(passwordForm);
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
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your store preferences and account settings
        </p>
      </motion.div>

      <AnimatePresence>
        {status.message && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className={cn(
              "flex items-center gap-2 p-3 rounded-xl border",
              status.type === "success" 
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
                : "bg-destructive/10 text-destructive border-destructive/20"
            )}
          >
            {status.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span className="text-xs font-semibold">{status.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
        <motion.aside
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="overflow-hidden">
            <div className="h-16 gradient-primary" />
            <CardContent className="p-4 -mt-8">
              <Avatar className="h-14 w-14 ring-4 ring-background">
                <AvatarFallback className="gradient-primary text-white text-sm font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="mt-3">
                <p className="text-sm font-bold">{user?.name || "Store Admin"}</p>
                <p className="text-[11px] text-muted-foreground">{user?.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2">
              <nav className="flex flex-col gap-0.5">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent text-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
                          isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold">{tab.label}</p>
                        <p className="text-[10px] text-muted-foreground">{tab.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </motion.aside>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeTab === "store" && (
            <Card>
              <form onSubmit={handleSaveStore}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Store & Profile Info</CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Update your administrator and business details
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Admin Name</Label>
                      <Input
                        value={storeForm.name}
                        onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                        className="h-10 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Admin Email</Label>
                      <Input
                        type="email"
                        value={storeForm.email}
                        onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                        className="h-10 text-sm"
                        required
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Store Name</Label>
                    <Input
                      value={storeForm.storeName}
                      onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                      className="h-10 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Store Phone</Label>
                      <Input
                        value={storeForm.storePhone}
                        onChange={(e) => setStoreForm({ ...storeForm, storePhone: e.target.value })}
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Store Address</Label>
                      <Input
                        value={storeForm.storeAddress}
                        onChange={(e) => setStoreForm({ ...storeForm, storeAddress: e.target.value })}
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="gap-2 h-9" disabled={isLoading}>
                      <Save className="h-3.5 w-3.5" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <form onSubmit={handleSavePassword}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Security</CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Manage password and access
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Current Password</Label>
                    <div className="relative group max-w-sm">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showOldPassword ? "text" : "password"}
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        className="pl-9 pr-9 h-10 text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">New Password</Label>
                    <div className="relative group max-w-sm">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="pl-9 pr-9 h-10 text-sm"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Confirm New Password</Label>
                    <div className="relative group max-w-sm">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="pl-9 h-10 text-sm"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Separator />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="gap-2 h-9" disabled={isLoading}>
                      <Save className="h-3.5 w-3.5" />
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}