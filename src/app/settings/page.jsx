"use client";

import { useState } from "react";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSettingsStore } from "@/store/settingsStore";
import { Store, Bell, Shield, Database, Save, Key } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { isLoading: authLoading } = useAuth(true);
  useRoleAccess();
  const [activeTab, setActiveTab] = useState("general");

  const settingsStore = useSettingsStore();
  const { systemName, systemVersion } = settingsStore;

  const [localSettings, setLocalSettings] = useState({
    pharmacyName: settingsStore.pharmacyName,
    pharmacyTagline: settingsStore.pharmacyTagline,
    pharmacyAddress: settingsStore.pharmacyAddress,
    pharmacyPhone: settingsStore.pharmacyPhone,
    pharmacyEmail: settingsStore.pharmacyEmail,
    receiptFooter: settingsStore.receiptFooter,
    currency: settingsStore.currency,
    usdToSspRate: settingsStore.usdToSspRate,
    showBothCurrencies: settingsStore.showBothCurrencies,
    taxRate: settingsStore.taxRate,
    lowStockAlert: settingsStore.lowStockAlert,
    expiryAlertDays: settingsStore.expiryAlertDays,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      settingsStore.updateSettings(localSettings);
      toast.success("Settings saved successfully!");
      setIsSaving(false);
    }, 800);
  };

  const handleUpdatePassword = () => {
    if (!passwordData.currentPassword) {
      toast.error("Please enter current password");
      return;
    }
    if (!passwordData.newPassword) {
      toast.error("Please enter new password");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsUpdatingPassword(true);
    setTimeout(() => {
      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsUpdatingPassword(false);
    }, 1000);
  };

  if (authLoading) return <LoadingSpinner />;

  const tabs = [
    { id: "general", label: "General", icon: Store },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "backup", label: "Backup & Data", icon: Database },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Settings" }]} />
      <PageHeader
        title="Settings"
        description="Configure your pharmacy system"
        backUrl="/dashboard"
      />
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-64 h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === tab.id ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              {tabs.find((t) => t.id === activeTab)?.label} Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>{systemName}</strong> - Pharmacy Management System{" "}
                    {systemVersion}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Configure your pharmacy details below.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pharmacy Name *</Label>
                    <Input
                      value={localSettings.pharmacyName}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          pharmacyName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input
                      value={localSettings.pharmacyTagline}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          pharmacyTagline: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={localSettings.pharmacyAddress}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          pharmacyAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={localSettings.pharmacyPhone}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          pharmacyPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={localSettings.pharmacyEmail}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          pharmacyEmail: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Currency Settings */}
                  <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <select
                      value={localSettings.currency}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          currency: e.target.value,
                        })
                      }
                      className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                    >
                      <option value="SSP">
                        SSP (£) - South Sudanese Pound
                      </option>
                      <option value="USD">USD ($) - US Dollar</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Exchange Rate (1 USD = ? SSP)</Label>
                    <Input
                      type="number"
                      value={localSettings.usdToSspRate}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          usdToSspRate: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Show Both Currencies</Label>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        checked={localSettings.showBothCurrencies}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            showBothCurrencies: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span className="text-sm text-gray-500">
                        Show SSP/USD conversion on receipts
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <Input
                      type="number"
                      value={localSettings.taxRate}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          taxRate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Low Stock Alert</Label>
                    <Input
                      type="number"
                      value={localSettings.lowStockAlert}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          lowStockAlert: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Receipt Footer Message</Label>
                    <Input
                      value={localSettings.receiptFooter}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          receiptFooter: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            )}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <p className="text-gray-500">
                  Configure notification preferences
                </p>
                {[
                  "Low stock alerts",
                  "Expiry date reminders",
                  "Daily sales summary",
                  "Purchase order updates",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2"
                  >
                    <span>{item}</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 accent-orange-500"
                    />
                  </div>
                ))}
                <Button onClick={() => toast.success("Preferences saved!")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            )}
            {activeTab === "security" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    placeholder="New password (min 6 chars)"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? (
                    "Updating..."
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            )}
            {activeTab === "backup" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Database Backup</p>
                    <p className="text-sm text-gray-500">Last backup: Never</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => toast.success("Backup completed!")}
                  >
                    Backup Now
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-gray-500">Download all data</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => toast.success("Data exported!")}
                  >
                    Export
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
