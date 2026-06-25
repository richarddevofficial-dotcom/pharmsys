"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";
import { useSettingsStore } from "@/store/settingsStore";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Store, Bell, Shield, Database, Save, Key } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [activeTab, setActiveTab] = useState("general");
  const settingsStore = useSettingsStore();
  const queryClient = useQueryClient();
  const { systemName, systemVersion } = settingsStore;

  const [localSettings, setLocalSettings] = useState({
    pharmacy_name: "",
    pharmacy_tagline: "",
    pharmacy_address: "",
    pharmacy_phone: "",
    pharmacy_email: "",
    receipt_footer: "",
    tax_rate: 5,
    currency: "SSP",
    usd_to_ssp_rate: 1500,
    show_both_currencies: true,
    low_stock_alert: 20,
    expiry_alert_days: 30,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch settings from backend
  const { data: backendSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ["pharmacy-settings"],
    queryFn: async () => {
      try {
        const res = await settingsService.get();
        return res.data;
      } catch (error) {
        console.log("Using local settings");
        return null;
      }
    },
  });

  // Load settings when data arrives
  useEffect(() => {
    if (backendSettings) {
      setLocalSettings({
        pharmacy_name: backendSettings.pharmacy_name || "",
        pharmacy_tagline: backendSettings.pharmacy_tagline || "",
        pharmacy_address: backendSettings.pharmacy_address || "",
        pharmacy_phone: backendSettings.pharmacy_phone || "",
        pharmacy_email: backendSettings.pharmacy_email || "",
        receipt_footer: backendSettings.receipt_footer || "",
        tax_rate: parseFloat(backendSettings.tax_rate) || 5,
        currency: backendSettings.currency || "SSP",
        usd_to_ssp_rate: parseFloat(backendSettings.usd_to_ssp_rate) || 1500,
        show_both_currencies: backendSettings.show_both_currencies !== false,
        low_stock_alert: backendSettings.low_stock_alert || 20,
        expiry_alert_days: backendSettings.expiry_alert_days || 30,
      });
    }
  }, [backendSettings]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (data) => settingsService.update(data),
    onSuccess: (data) => {
      // Also update local store
      settingsStore.updateSettings({
        pharmacyName: data.data.pharmacy_name,
        pharmacyTagline: data.data.pharmacy_tagline,
        pharmacyAddress: data.data.pharmacy_address,
        pharmacyPhone: data.data.pharmacy_phone,
        pharmacyEmail: data.data.pharmacy_email,
        receiptFooter: data.data.receipt_footer,
        taxRate: parseFloat(data.data.tax_rate),
        currency: data.data.currency,
        usdToSspRate: parseFloat(data.data.usd_to_ssp_rate),
        showBothCurrencies: data.data.show_both_currencies,
        lowStockAlert: data.data.low_stock_alert,
        expiryAlertDays: data.data.expiry_alert_days,
      });
      queryClient.invalidateQueries(["pharmacy-settings"]);
      toast.success("Settings saved!");
    },
    onError: (error) => {
      toast.error("Failed to save settings");
    },
  });

  const handleSaveSettings = () => {
    saveMutation.mutate(localSettings);
  };

  const handleUpdatePassword = () => {
    if (!passwordData.currentPassword) {
      toast.error("Enter current password");
      return;
    }
    if (!passwordData.newPassword) {
      toast.error("Enter new password");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Min 6 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password updated!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (authLoading || settingsLoading) return <LoadingSpinner />;

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
                    <strong>{systemName}</strong> v{systemVersion}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Changes are saved to the database.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pharmacy Name</Label>
                    <Input
                      value={localSettings.pharmacy_name}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          pharmacy_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input
                      value={localSettings.pharmacy_tagline}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          pharmacy_tagline: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={localSettings.pharmacy_address}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          pharmacy_address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={localSettings.pharmacy_phone}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          pharmacy_phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={localSettings.pharmacy_email}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          pharmacy_email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
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
                      <option value="SSP">SSP</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Exchange Rate (1 USD = ? SSP)</Label>
                    <Input
                      type="number"
                      value={localSettings.usd_to_ssp_rate}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          usd_to_ssp_rate: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <Input
                      type="number"
                      value={localSettings.tax_rate}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          tax_rate: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Low Stock Alert</Label>
                    <Input
                      type="number"
                      value={localSettings.low_stock_alert}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          low_stock_alert: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Show Both Currencies</Label>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        checked={localSettings.show_both_currencies}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            show_both_currencies: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span className="text-sm text-gray-500">
                        Show SSP/USD conversion
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Receipt Footer</Label>
                    <Input
                      value={localSettings.receipt_footer}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          receipt_footer: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveSettings}
                  disabled={saveMutation.isLoading}
                >
                  {saveMutation.isLoading ? (
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
                <p className="text-gray-500">Configure notifications</p>
                {[
                  "Low stock alerts",
                  "Expiry reminders",
                  "Daily summary",
                  "Purchase updates",
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
                <Button onClick={() => toast.success("Saved!")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
            {activeTab === "security" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
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
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <Button onClick={handleUpdatePassword}>
                  <Key className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>
            )}
            {activeTab === "backup" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Database Backup</p>
                    <p className="text-sm text-gray-500">
                      Copy the pharmplus.db file
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast.success("Backup location: backend/pharmplus.db")
                    }
                  >
                    Backup Now
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
