"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Pill, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { pharmacyName, systemName } = useSettingsStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      login(username, password);
      toast.success("Welcome!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
      setLoading(false);
    }
  };

  const quickLogin = (u, p) => {
    setUsername(u);
    setPassword(p);
    setLoading(true);
    try {
      login(u, p);
      toast.success("Welcome!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Pill className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{pharmacyName}</CardTitle>
          <CardDescription>
            Powered by {systemName} - Sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-6 space-y-2">
            <p className="text-sm text-center text-gray-500">Demo Accounts</p>
            {[
              { name: "Super Admin", u: "admin", p: "admin123" },
              { name: "Pharmacist", u: "pharmacist", p: "pharm123" },
              { name: "Cashier", u: "cashier", p: "cash123" },
              { name: "Store Manager", u: "manager", p: "mgr123" },
            ].map((acc) => (
              <button
                key={acc.u}
                type="button"
                onClick={() => quickLogin(acc.u, acc.p)}
                disabled={loading}
                className="w-full p-3 text-left rounded-lg border hover:border-orange-500 hover:bg-orange-50 transition-all disabled:opacity-50"
              >
                <span className="font-medium text-sm">{acc.name}</span>
                <span className="text-xs text-gray-400 ml-2">
                  {acc.u} / {acc.p}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-orange-800 text-center">
              💡 <strong>Demo Mode:</strong> Using local authentication. Backend
              API not required.
            </p>
          </div>
        </CardContent>
      </Card>
      <p className="mt-6 text-xs text-gray-400">
        Powered by{" "}
        <span className="text-orange-500 font-medium">{systemName}</span>
      </p>
    </div>
  );
}
