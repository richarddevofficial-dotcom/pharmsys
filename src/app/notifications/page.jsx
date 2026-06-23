"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Bell,
  AlertTriangle,
  Package,
  CheckCircle,
  Clock,
  Trash2,
  CheckCheck,
} from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    type: "low_stock",
    title: "Low Stock Alert",
    message: "Amoxicillin 250mg is running low (5 units remaining)",
    is_read: false,
    created_at: "2024-01-15T14:30:00",
  },
  {
    id: 2,
    type: "expiry",
    title: "Expiry Alert",
    message: "Omeprazole 20mg expires in 15 days",
    is_read: false,
    created_at: "2024-01-15T10:00:00",
  },
  {
    id: 3,
    type: "order",
    title: "Purchase Order Received",
    message: "PO-001 from MedSupply Co. has been received",
    is_read: true,
    created_at: "2024-01-14T16:45:00",
  },
  {
    id: 4,
    type: "payment",
    title: "Payment Confirmed",
    message: "Payment of $450.75 received from John Doe",
    is_read: true,
    created_at: "2024-01-14T09:15:00",
  },
];

export default function NotificationsPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [notifications, setNotifications] = useState(mockNotifications);

  const getIcon = (type) => {
    switch (type) {
      case "low_stock":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "expiry":
        return <Clock className="h-5 w-5 text-red-500" />;
      case "order":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "payment":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Notifications" }]} />
      <PageHeader
        title="Notifications"
        description={`You have ${unreadCount} unread notifications`}
        backUrl="/dashboard"
        actions={
          <Button
            variant="outline"
            onClick={() =>
              setNotifications(
                notifications.map((n) => ({ ...n, is_read: true })),
              )
            }
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${!n.is_read ? "bg-orange-50" : ""}`}
              >
                <div className="mt-1">{getIcon(n.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{n.title}</h3>
                    {!n.is_read && <Badge className="text-xs">New</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
