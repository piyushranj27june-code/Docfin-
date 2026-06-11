import { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Svg, {
  Path,
  Circle,
  Line as SvgLine,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { colors, fontWeight, radius, spacing, formatINR } from "@/src/theme";

export interface TrendSeries {
  label: string;
  color: string;
  /** Numeric values aligned to `labels`. */
  values: number[];
  /** Show filled area under the line (only sensible for the primary series). */
  showArea?: boolean;
}

interface TrendChartProps {
  /** X-axis labels (e.g. "2025-04", "2025-05" ...). */
  labels: string[];
  series: TrendSeries[];
  height?: number;
  /** Y-axis number formatter (defaults to formatINR). */
  formatY?: (n: number) => string;
  /** Title displayed above the chart. */
  title?: string;
  /** Subtitle / context line. */
  subtitle?: string;
}

/**
 * Lightweight multi-series line / area chart for monthly trends.
 * - Uses react-native-svg for crisp lines.
 * - Tap a data point to inspect the exact value for that period.
 * - Horizontally scrolls when there are many data points so labels never collide.
 */
export function TrendChart({
  labels,
  series,
  height = 180,
  formatY = formatINR,
  title,
  subtitle,
}: TrendChartProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const safe = labels.length > 0 && series.length > 0;

  // Layout
  const POINT_W = Math.max(56, Math.min(80, labels.length <= 6 ? 64 : 60));
  const chartWidth = Math.max(POINT_W * Math.max(labels.length, 2), 280);
  const PAD_L = 12;
  const PAD_R = 12;
  const PAD_T = 16;
  const PAD_B = 28;
  const innerW = chartWidth - PAD_L - PAD_R;
  const innerH = height - PAD_T - PAD_B;

  const { minY, maxY } = useMemo(() => {
    if (!safe) return { minY: 0, maxY: 1 };
    let lo = Infinity;
    let hi = -Infinity;
    for (const s of series) {
      for (const v of s.values) {
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
    }
    if (!isFinite(lo) || !isFinite(hi)) return { minY: 0, maxY: 1 };
    if (lo === hi) {
      const pad = Math.abs(lo) * 0.2 || 1;
      return { minY: lo - pad, maxY: hi + pad };
    }
    // Add 12% headroom on both sides so the line never hugs the edges.
    const range = hi - lo;
    return { minY: lo - range * 0.12, maxY: hi + range * 0.12 };
  }, [series, safe]);

  const xFor = (i: number) => {
    if (labels.length <= 1) return PAD_L + innerW / 2;
    return PAD_L + (i / (labels.length - 1)) * innerW;
  };
  const yFor = (v: number) => {
    const t = (v - minY) / (maxY - minY || 1);
    return PAD_T + (1 - t) * innerH;
  };

  const buildPath = (vals: number[]) => {
    if (vals.length === 0) return "";
    return vals
      .map((v, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(2)},${yFor(v).toFixed(2)}`)
      .join(" ");
  };

  const buildAreaPath = (vals: number[]) => {
    if (vals.length === 0) return "";
    const line = vals
      .map((v, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(2)},${yFor(v).toFixed(2)}`)
      .join(" ");
    const lastX = xFor(vals.length - 1).toFixed(2);
    const firstX = xFor(0).toFixed(2);
    const baseY = (PAD_T + innerH).toFixed(2);
    return `${line} L${lastX},${baseY} L${firstX},${baseY} Z`;
  };

  // Horizontal grid (4 lines) labels
  const gridLines = useMemo(() => {
    const lines: { y: number; label: string }[] = [];
    const STEPS = 3;
    for (let i = 0; i <= STEPS; i++) {
      const v = minY + ((maxY - minY) * (STEPS - i)) / STEPS;
      lines.push({ y: PAD_T + (i / STEPS) * innerH, label: formatY(v) });
    }
    return lines;
  }, [minY, maxY, innerH, formatY]);

  if (!safe) {
    return (
      <View style={[styles.card, { height: height + 60, justifyContent: "center" }]}>
        <Text style={styles.emptyText}>Not enough data to plot trend.</Text>
      </View>
    );
  }

  const lastVals = series.map((s) => s.values[s.values.length - 1] ?? 0);
  const prevVals = series.map((s) => s.values[s.values.length - 2] ?? lastVals[0]);
  const headlineChange =
    prevVals[0] !== 0 ? ((lastVals[0] - prevVals[0]) / Math.abs(prevVals[0])) * 100 : 0;

  return (
    <View style={styles.card}>
      {(title || subtitle) && (
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {prevVals[0] !== 0 && (
            <View
              style={[
                styles.deltaPill,
                {
                  backgroundColor:
                    headlineChange >= 0 ? "#E8F3ED" : "#FDECEA",
                },
              ]}
            >
              <Text
                style={[
                  styles.deltaText,
                  { color: headlineChange >= 0 ? colors.success : colors.error },
                ]}
              >
                {headlineChange >= 0 ? "▲" : "▼"} {Math.abs(headlineChange).toFixed(1)}%
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.legendRow}>
        {series.map((s) => (
          <View key={s.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: s.color }]} />
            <Text style={styles.legendLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        <View>
          <Svg width={chartWidth} height={height}>
            <Defs>
              {series.map((s, idx) => (
                <LinearGradient
                  key={`grad-${idx}`}
                  id={`grad-${idx}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <Stop offset="0" stopColor={s.color} stopOpacity={0.28} />
                  <Stop offset="1" stopColor={s.color} stopOpacity={0.02} />
                </LinearGradient>
              ))}
            </Defs>

            {/* Horizontal grid */}
            {gridLines.map((g, i) => (
              <SvgLine
                key={`grid-${i}`}
                x1={PAD_L}
                x2={chartWidth - PAD_R}
                y1={g.y}
                y2={g.y}
                stroke={colors.border}
                strokeWidth={1}
                strokeDasharray={i === gridLines.length - 1 ? undefined : "3,4"}
              />
            ))}

            {/* Y-axis labels (drawn on top-left of each grid line) */}
            {gridLines.map((g, i) => (
              <SvgText
                key={`yl-${i}`}
                x={PAD_L + 2}
                y={g.y - 3}
                fontSize="9"
                fill={colors.textMuted}
                fontWeight="600"
              >
                {g.label}
              </SvgText>
            ))}

            {/* Areas */}
            {series.map((s, idx) =>
              s.showArea ? (
                <Path
                  key={`area-${idx}`}
                  d={buildAreaPath(s.values)}
                  fill={`url(#grad-${idx})`}
                />
              ) : null
            )}

            {/* Lines */}
            {series.map((s, idx) => (
              <Path
                key={`line-${idx}`}
                d={buildPath(s.values)}
                stroke={s.color}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
            ))}

            {/* Active vertical indicator */}
            {activeIdx !== null && (
              <SvgLine
                x1={xFor(activeIdx)}
                x2={xFor(activeIdx)}
                y1={PAD_T}
                y2={PAD_T + innerH}
                stroke={colors.text}
                strokeWidth={1}
                strokeDasharray="2,3"
                opacity={0.45}
              />
            )}

            {/* Data points */}
            {series.map((s, sIdx) =>
              s.values.map((v, i) => (
                <Circle
                  key={`pt-${sIdx}-${i}`}
                  cx={xFor(i)}
                  cy={yFor(v)}
                  r={activeIdx === i ? 5 : sIdx === 0 ? 3 : 2.5}
                  fill={activeIdx === i ? s.color : colors.card}
                  stroke={s.color}
                  strokeWidth={2}
                />
              ))
            )}

            {/* X labels */}
            {labels.map((lbl, i) => (
              <SvgText
                key={`xl-${i}`}
                x={xFor(i)}
                y={height - 8}
                fontSize="9"
                fill={colors.textMuted}
                fontWeight="600"
                textAnchor="middle"
              >
                {shortMonth(lbl)}
              </SvgText>
            ))}
          </Svg>

          {/* Tap-targets overlay (one tall column per data point) */}
          <View style={[styles.touchRow, { width: chartWidth, height: innerH, top: PAD_T }]}>
            {labels.map((_, i) => {
              const left = xFor(i) - POINT_W / 2;
              return (
                <TouchableOpacity
                  key={`tap-${i}`}
                  onPress={() => setActiveIdx(activeIdx === i ? null : i)}
                  activeOpacity={0.7}
                  style={[styles.touchCol, { left, width: POINT_W, height: innerH }]}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      {activeIdx !== null && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipMonth}>{labels[activeIdx]}</Text>
          {series.map((s) => (
            <View key={`tt-${s.label}`} style={styles.tooltipRow}>
              <View style={[styles.legendDot, { backgroundColor: s.color }]} />
              <Text style={styles.tooltipLabel}>{s.label}</Text>
              <Text style={styles.tooltipValue}>{formatY(s.values[activeIdx] ?? 0)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function shortMonth(label: string) {
  // Accepts "YYYY-MM" or any string, returns short label.
  const m = /^(\d{4})-(\d{2})$/.exec(label);
  if (!m) return label;
  const month = parseInt(m[2], 10);
  const yr = m[1].slice(2);
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[month - 1] || m[2]} '${yr}`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  deltaPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  deltaText: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: spacing.sm,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: fontWeight.semibold,
  },
  touchRow: {
    position: "absolute",
  },
  touchCol: {
    position: "absolute",
  },
  tooltip: {
    marginTop: spacing.sm,
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  tooltipMonth: {
    fontSize: 12,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: 6,
  },
  tooltipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 3,
  },
  tooltipLabel: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
  },
  tooltipValue: {
    fontSize: 12,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
  },
});
