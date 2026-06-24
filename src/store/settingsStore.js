import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create()(
  persist(
    (set) => ({
      // YOUR BRAND - These stay fixed
      systemName: "PharmPlus",
      systemVersion: "v1.0",
      systemWebsite: "www.pharmplus.com",
      systemSupport: "support@pharmplus.com",

      // CLIENT PHARMACY - These are editable
      pharmacyName: "Good Life Pharmacy",
      pharmacyTagline: "Your Health, Our Priority",
      pharmacyAddress: "123 Health Street, Juba",
      pharmacyPhone: "+211 123 456 789",
      pharmacyEmail: "info@goodlifepharmacy.com",
      receiptFooter: "Thank you for choosing Good Life Pharmacy!",

      // Currency settings
      currency: "SSP",
      currencySymbol: "£",
      usdToSspRate: 1500,
      showBothCurrencies: true,

      taxRate: 5,
      lowStockAlert: 20,
      expiryAlertDays: 30,

      updateSettings: (newSettings) => set(newSettings),
    }),
    {
      name: "pharmacy-settings",
    },
  ),
);
