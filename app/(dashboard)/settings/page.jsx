"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStoreInfo,
  updateReceiptSettings,
  updateNotificationSettings,
} from "@/store/slices/settingsSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Store,
  Receipt,
  Bell,
  Save,
  CheckCircle2,
  User,
  Palette,
  Shield,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const settingsTabs = [
  { id: "store", label: "Store Info", icon: Store, desc: "Business details" },
  { id: "receipt", label: "Receipt", icon: Receipt, desc: "Print settings" },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Alert preferences" },
  { id: "appearance", label: "Appearance", icon: Palette, desc: "Theme & display" },
  { id: "security", label: "Security", icon: Shield, desc: "Password & access" },
];

export default function SettingsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { storeInfo, receiptSettings, notificationSettings } = useSelector((s) => s.settings);
  const { user } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState("store");
  const [saved, setSaved] = useState(false);

  const [storeForm, setStoreForm] = useState({ ...storeInfo });
  const [receiptForm, setReceiptForm] = useState({ ...receiptSettings });
  const [notifForm, setNotifForm] = useState({ ...notificationSettings });

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveStore = () => {
    dispatch(updateStoreInfo(storeForm));
    showSaved();
  };

  const handleSaveReceipt = () => {
    dispatch(updateReceiptSettings(receiptForm));
    showSaved();
  };

  const handleSaveNotif = () => {
    dispatch(updateNotificationSettings(notifForm));
    showSaved();
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
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="text-xs font-semibold">Settings saved successfully!</span>
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
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Store Information</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Update your business details
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Store Name</Label>
                    <Input
                      value={storeForm.name}
                      onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                      className="h-10 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Phone Number</Label>
                    <Input
                      value={storeForm.phone}
                      onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                      className="h-10 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Address</Label>
                  <Input
                    value={storeForm.address}
                    onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                    className="h-10 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Email</Label>
                    <Input
                      type="email"
                      value={storeForm.email}
                      onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                      className="h-10 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Currency</Label>
                    <Input
                      value={storeForm.currency}
                      onChange={(e) => setStoreForm({ ...storeForm, currency: e.target.value })}
                      className="h-10 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={storeForm.taxRate}
                    onChange={(e) =>
                      setStoreForm({ ...storeForm, taxRate: parseFloat(e.target.value) || 0 })
                    }
                    className="h-10 text-sm w-40"
                  />
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSaveStore} size="sm" className="gap-2 h-9">
                    <Save className="h-3.5 w-3.5" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "receipt" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Receipt Settings</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Customize how your receipts look
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Header Text</Label>
                  <Input
                    value={receiptForm.headerText}
                    onChange={(e) => setReceiptForm({ ...receiptForm, headerText: e.target.value })}
                    className="h-10 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Footer Text</Label>
                  <Input
                    value={receiptForm.footerText}
                    onChange={(e) => setReceiptForm({ ...receiptForm, footerText: e.target.value })}
                    className="h-10 text-sm"
                  />
                </div>
                <Separator />
                <div className="space-y-3">
                  {[
                    { key: "showLogo", label: "Show Logo", desc: "Display store logo on receipts" },
                    { key: "showPhone", label: "Show Phone", desc: "Display phone number on receipts" },
                    { key: "showAddress", label: "Show Address", desc: "Display store address on receipts" },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <Label className="text-xs font-semibold">{item.label}</Label>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                      <Switch
                        checked={receiptForm[item.key]}
                        onCheckedChange={(c) => setReceiptForm({ ...receiptForm, [item.key]: c })}
                      />
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSaveReceipt} size="sm" className="gap-2 h-9">
                    <Save className="h-3.5 w-3.5" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Notification Preferences</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Configure your alerts
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-5 space-y-3">
                {[
                  { key: "lowStockAlert", label: "Low Stock Alerts", desc: "Notify when stock is running low" },
                  { key: "outOfStockAlert", label: "Out of Stock Alerts", desc: "Notify when products are out of stock" },
                  { key: "creditOverdueAlert", label: "Credit Overdue Alerts", desc: "Notify when credits are overdue" },
                  { key: "dailyReport", label: "Daily Report Summary", desc: "Receive daily sales report via email" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <Label className="text-xs font-semibold">{item.label}</Label>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifForm[item.key]}
                      onCheckedChange={(c) => setNotifForm({ ...notifForm, [item.key]: c })}
                    />
                  </div>
                ))}
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotif} size="sm" className="gap-2 h-9">
                    <Save className="h-3.5 w-3.5" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Palette className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Appearance</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Customize theme and layout
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-5">
                <div className="text-center py-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-3">
                    <Palette className="h-7 w-7" />
                  </div>
                  <p className="text-sm font-semibold mb-1">Theme Customization</p>
                  <p className="text-xs text-muted-foreground">
                    Use the theme toggle in the header to switch between light and dark modes
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
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
                <div className="p-4 rounded-xl bg-accent/30">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-0.5">Change Password</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Update your password regularly to keep your account secure
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={() => router.push("/forgot-password")}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}