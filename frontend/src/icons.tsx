/**
 * Icon shim that maps lucide-react-native style icons to @expo/vector-icons Feather.
 * Keeps existing component imports working without adding native deps.
 */
import React from "react";
import { Feather } from "@expo/vector-icons";

type IconProps = {
  size?: number;
  color?: string;
};

// Map our preferred lucide names → Feather icon names
const map = {
  Stethoscope: "activity",
  ArrowLeft: "arrow-left",
  LayoutDashboard: "grid",
  Receipt: "file-text",
  TrendingUp: "trending-up",
  Building2: "home",
  Sparkles: "zap",
  Wallet: "credit-card",
  Activity: "activity",
  LogOut: "log-out",
  PiggyBank: "dollar-sign",
  Plus: "plus",
  Trash2: "trash-2",
  X: "x",
  Calculator: "percent",
  FileText: "file-text",
  AlertTriangle: "alert-triangle",
  Send: "send",
  Scale: "bar-chart-2",
} as const;

function make(name: keyof typeof map) {
  const Component = ({ size = 20, color = "#000" }: IconProps) => (
    <Feather name={map[name] as any} size={size} color={color} />
  );
  Component.displayName = name;
  return Component;
}

export const Stethoscope = make("Stethoscope");
export const ArrowLeft = make("ArrowLeft");
export const LayoutDashboard = make("LayoutDashboard");
export const Receipt = make("Receipt");
export const TrendingUp = make("TrendingUp");
export const Building2 = make("Building2");
export const Sparkles = make("Sparkles");
export const Wallet = make("Wallet");
export const Activity = make("Activity");
export const LogOut = make("LogOut");
export const PiggyBank = make("PiggyBank");
export const Plus = make("Plus");
export const Trash2 = make("Trash2");
export const X = make("X");
export const Calculator = make("Calculator");
export const FileText = make("FileText");
export const AlertTriangle = make("AlertTriangle");
export const Send = make("Send");
export const Scale = make("Scale");
