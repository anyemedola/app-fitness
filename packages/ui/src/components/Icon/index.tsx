import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

import type { IconName } from "../../types";

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
}

/** Line-icon set ported 1:1 from the design reference's `icons.jsx`. */
export function Icon({ name, size = 24, color = "#123B37", strokeWidth = 2, filled = false }: IconProps) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  const fillable = { ...common, fill: filled ? color : "none" };

  switch (name) {
    case "home":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 10.5 12 3l9 7.5" {...common} />
          <Path d="M5 9.5V20h14V9.5" {...common} />
          <Path d="M9.5 20v-5h5v5" {...common} />
        </Svg>
      );
    case "groups":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={9} cy={8} r={3.2} {...common} />
          <Path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" {...common} />
          <Path d="M16 6.2A3 3 0 0 1 16 12" {...common} />
          <Path d="M18 14c2.4.4 3.5 2.3 3.5 5" {...common} />
        </Svg>
      );
    case "trophy":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" {...common} />
          <Path d="M7 5H4v2a3 3 0 0 0 3 3" {...common} />
          <Path d="M17 5h3v2a3 3 0 0 1-3 3" {...common} />
          <Path d="M12 13v4" {...common} />
          <Path d="M8.5 21h7" {...common} />
          <Path d="M9.5 21c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5" {...common} />
        </Svg>
      );
    case "user":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={8} r={3.6} {...common} />
          <Path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6" {...common} />
        </Svg>
      );
    case "plus":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 5v14M5 12h14" {...common} />
        </Svg>
      );
    case "drop":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 3.2C12 3.2 5.5 9.8 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 9.8 12 3.2 12 3.2Z" {...fillable} />
        </Svg>
      );
    case "leaf":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M20 4C9 4 4 9 4 17c0 1 0 2 .5 3 6-7 9-8 14-9-4 .4-8 2-11 6"
            {...fillable}
          />
        </Svg>
      );
    case "dumbbell":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" {...common} />
        </Svg>
      );
    case "flame":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M12 3c.5 3-2 4.5-2 7a2 2 0 0 0 4 0c0-.7-.2-1.2-.2-1.5 2 1.4 3.2 3.6 3.2 6a5 5 0 0 1-10 0c0-4 3-6.5 5-11.5Z"
            {...fillable}
          />
        </Svg>
      );
    case "sun":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={4} {...common} />
          <Path
            d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            {...common}
          />
        </Svg>
      );
    case "camera":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" {...common} />
          <Circle cx={12} cy={13} r={3.4} {...common} />
        </Svg>
      );
    case "heart":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 20S4 14.5 4 9.2A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 8 2.2C20 14.5 12 20 12 20Z" {...fillable} />
        </Svg>
      );
    case "comment":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M21 12a8 8 0 0 1-11.5 7.2L4 20.5l1.3-5A8 8 0 1 1 21 12Z" {...common} />
        </Svg>
      );
    case "bell":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 9a6 6 0 0 1 12 0c0 5 1.5 6 1.5 6h-15S6 14 6 9Z" {...fillable} />
          <Path d="M10 19a2 2 0 0 0 4 0" {...common} />
        </Svg>
      );
    case "check":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 12.5 9.5 18 20 6" {...common} />
        </Svg>
      );
    case "chevron":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M9 5l7 7-7 7" {...common} />
        </Svg>
      );
    case "chevronLeft":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M15 5l-7 7 7 7" {...common} />
        </Svg>
      );
    case "target":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={8.5} {...common} />
          <Circle cx={12} cy={12} r={4.5} {...common} />
          <Circle cx={12} cy={12} r={1} {...common} />
        </Svg>
      );
    case "medal":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={14} r={5.5} {...common} />
          <Path d="M8.5 9 6 3h12l-2.5 6" {...common} />
          <Path d="M12 12.5 13 14.5 15 14.8 13.5 16.3 13.9 18.3 12 17.3 10.1 18.3 10.5 16.3 9 14.8 11 14.5Z" {...common} />
        </Svg>
      );
    case "plusCircle":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={9} {...common} />
          <Path d="M12 8.5v7M8.5 12h7" {...common} />
        </Svg>
      );
    case "clock":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={8.5} {...common} />
          <Path d="M12 7.5V12l3 2" {...common} />
        </Svg>
      );
    case "send":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 12 20 4l-6 16-2.5-6.5L4 12Z" {...common} />
        </Svg>
      );
    case "lock":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M5 11h14v9H5z" {...common} />
          <Path d="M8 11V8a4 4 0 0 1 8 0v3" {...common} />
        </Svg>
      );
    case "settings":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={3} {...common} />
          <Path
            d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
            {...common}
          />
        </Svg>
      );
    case "share":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 15V4M8 7l4-3 4 3" {...common} />
          <Path d="M6 12H5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-1" {...common} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={8} {...common} />
        </Svg>
      );
  }
}
