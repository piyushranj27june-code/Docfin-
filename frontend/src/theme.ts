/**
 * Design tokens for Doctor Finance AI
 * Per /app/design_guidelines.json - Organic & Earthy palette.
 */
export const colors = {
  bg: "#F9F9F8",
  bgSecondary: "#F0EFEA",
  card: "#FFFFFF",
  border: "#E5E5E5",
  text: "#1A1A1A",
  textMuted: "#5C5C5C",
  textInverse: "#FFFFFF",
  brand: "#1A4331",
  brandLight: "#E8F3ED",
  accent: "#CC5A3A",
  accentLight: "#FAEFEA",
  success: "#2E7D32",
  warning: "#F57C00",
  error: "#D32F2F",
  info: "#0288D1",
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  black: "800" as const,
};

export const shadow = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
};

export const formatINR = (n: number) => {
  if (n === undefined || n === null || isNaN(n)) return "₹0";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
  return `${sign}₹${abs.toFixed(0)}`;
};

export const formatINRFull = (n: number) => {
  if (n === undefined || n === null || isNaN(n)) return "₹0";
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};
