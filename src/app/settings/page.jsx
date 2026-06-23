"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Store, Bell, Shield, Database, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    pharmacy_name: "My Pharmacy",
    address: "123 Health Street",
    phone: "+1 234-567-8900",
    email: "info@mypharmacy.com",
    tax_rate: "5",
    currency: "USD",
    low_stock_alert: "20",
    expiry_alert_days: "30",
    receipt_footer: "Thank you for choosing us!",
  });

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pharmacy Name</Label>
                    <Input
                      value={settings.pharmacy_name}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pharmacy_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={settings.phone}
                      onChange={(e) =>
                        setSettings({ ...settings, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <select
                      value={settings.currency}
                      onChange={(e) =>
                        setSettings({ ...settings, currency: e.target.value })
                      }
                      className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={settings.address}
                      onChange={(e) =>
                        setSettings({ ...settings, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <Input
                      type="number"
                      value={settings.tax_rate}
                      onChange={(e) =>
                        setSettings({ ...settings, tax_rate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Low Stock Alert</Label>
                    <Input
                      type="number"
                      value={settings.low_stock_alert}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          low_stock_alert: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Receipt Footer</Label>
                    <textarea
                      value={settings.receipt_footer}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          receipt_footer: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <Button onClick={() => toast.success("Settings saved!")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
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
                    <input type="checkbox" defaultChecked />
                  </div>
                ))}
              </div>
            )}
            {activeTab === "security" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Change Password</Label>
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button>Update Password</Button>
              </div>
            )}
            {activeTab === "backup" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Database Backup</p>
                    <p className="text-sm text-gray-500">Last backup: Never</p>
                  </div>
                  <Button variant="outline">Backup Now</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-gray-500">
                      Download all data as CSV
                    </p>
                  </div>
                  <Button variant="outline">Export</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
