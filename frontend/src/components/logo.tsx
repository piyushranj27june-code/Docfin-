import { View, Text, StyleSheet } from "react-native";
import { colors, fontWeight } from "@/src/theme";

interface LogoProps {
  size?: number;
  variant?: "badge" | "full";
  /** "dark" (default) for light backgrounds; "light" inverts the wordmark for dark backgrounds. */
  tone?: "dark" | "light";
}

/**
 * DocFin brand mark.
 * - "badge": just the rounded-square monogram with "Df" + accent dot
 * - "full": badge + "DocFin" wordmark to the right
 */
export function Logo({ size = 56, variant = "badge", tone = "dark" }: LogoProps) {
  const badge = (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
        },
      ]}
    >
      <Text
        style={[
          styles.mono,
          {
            fontSize: size * 0.5,
            lineHeight: size * 0.5,
          },
        ]}
      >
        Df
      </Text>
      <View
        style={[
          styles.dot,
          {
            width: size * 0.16,
            height: size * 0.16,
            borderRadius: size * 0.08,
            right: size * 0.14,
            top: size * 0.14,
          },
        ]}
      />
    </View>
  );

  if (variant === "badge") return badge;

  return (
    <View style={styles.full}>
      {badge}
      <Text
        style={[
          styles.wordmark,
          { fontSize: size * 0.55, color: tone === "light" ? "#F4F1E8" : colors.text },
        ]}
      >
        DocFin
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  mono: {
    color: "#FFFFFF",
    fontWeight: fontWeight.black,
    letterSpacing: -1,
    fontFamily: "serif",
  },
  dot: {
    position: "absolute",
    backgroundColor: colors.accent,
  },
  full: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  wordmark: {
    fontWeight: fontWeight.black,
    letterSpacing: -1,
  },
});
