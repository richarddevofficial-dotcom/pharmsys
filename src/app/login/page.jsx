// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useAuthStore } from "@/store/authStore";
// import { Pill, Eye, EyeOff } from "lucide-react";
// import toast from "react-hot-toast";

// const loginSchema = z.object({
//   username: z.string().min(1, "Username is required"),
//   password: z.string().min(1, "Password is required"),
// });

// export default function LoginPage() {
//   const router = useRouter();
//   const { login } = useAuthStore();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data) => {
//     try {
//       setIsLoading(true);
//       await login(data.username, data.password);
//       toast.success("Welcome back!");
//       router.push("/dashboard");
//     } catch (error) {
//       const message = error.response?.data?.detail || "Invalid credentials";
//       toast.error(message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1 text-center">
//           <div className="flex justify-center mb-4">
//             <div className="p-3 bg-blue-100 rounded-full">
//               <Pill className="h-8 w-8 text-blue-600" />
//             </div>
//           </div>
//           <CardTitle className="text-2xl font-bold">
//             Pharmacy Management
//           </CardTitle>
//           <CardDescription>Sign in to manage your pharmacy</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 placeholder="Enter your username"
//                 {...register("username")}
//                 error={errors.username?.message}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   {...register("password")}
//                   error={errors.password?.message}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4" />
//                   ) : (
//                     <Eye className="h-4 w-4" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <a
//                 href="/forgot-password"
//                 className="text-sm text-blue-600 hover:text-blue-500"
//               >
//                 Forgot password?
//               </a>
//             </div>

//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   Signing in...
//                 </div>
//               ) : (
//                 "Sign in"
//               )}
//             </Button>
//           </form>

//           <div className="mt-6 p-3 bg-gray-50 rounded-lg">
//             <p className="text-xs text-gray-600 text-center font-medium">
//               Demo Credentials
//             </p>
//             <div className="mt-2 space-y-1 text-xs text-gray-500">
//               <p>
//                 Admin:{" "}
//                 <code className="bg-gray-200 px-1 rounded">
//                   admin / admin123
//                 </code>
//               </p>
//               <p>
//                 Pharmacist:{" "}
//                 <code className="bg-gray-200 px-1 rounded">
//                   pharmacist / pharm123
//                 </code>
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Pill, Eye, EyeOff, User, Key } from "lucide-react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await login(data.username, data.password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.detail || error.message || "Invalid credentials";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login with demo account
  const quickLogin = (username, password) => {
    setValue("username", username);
    setValue("password", password);
    onSubmit({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Pill className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Pharmacy Management
          </CardTitle>
          <CardDescription>Sign in to manage your pharmacy</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="pl-10"
                  {...register("username")}
                  error={errors.username?.message}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  {...register("password")}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Demo Accounts
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => quickLogin("admin", "admin123")}
                className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">Super Admin</p>
                    <p className="text-xs text-gray-500">
                      Full access to all features
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    <code>admin / admin123</code>
                  </div>
                </div>
              </button>

              <button
                onClick={() => quickLogin("pharmacist", "pharm123")}
                className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">Pharmacist</p>
                    <p className="text-xs text-gray-500">
                      Manage medicines and sales
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    <code>pharmacist / pharm123</code>
                  </div>
                </div>
              </button>

              <button
                onClick={() => quickLogin("cashier", "cash123")}
                className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">Cashier</p>
                    <p className="text-xs text-gray-500">
                      Process sales and receipts
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    <code>cashier / cash123</code>
                  </div>
                </div>
              </button>

              <button
                onClick={() => quickLogin("manager", "mgr123")}
                className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">Store Manager</p>
                    <p className="text-xs text-gray-500">
                      Manage stock and suppliers
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    <code>manager / mgr123</code>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              💡 <strong>Demo Mode:</strong> Using local authentication. Backend
              API not required.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
