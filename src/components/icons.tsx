import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { HoldType } from '../types';

export interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const stroke = (color: string, w: number) => ({
  stroke: color,
  strokeWidth: w,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
});

const Frame: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 24,
  children,
}) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    {children}
  </Svg>
);

// ---------- HOLD-TYPE ICONS ----------

export const JugIcon: React.FC<IconProps> = ({ size, color = '#FFFFFF', strokeWidth = 1.6 }) => (
  <Frame size={size}>
    <G {...stroke(color, strokeWidth)}>
      {/* Big rounded jug hold */}
      <Path d="M 3 27 Q 16 11 29 27" />
      {/* 4 fingertips wrapping over the top */}
      <Path d="M 10 14 L 10 19" />
      <Path d="M 14 12 L 14 17" />
      <Path d="M 18 12 L 18 17" />
      <Path d="M 22 14 L 22 19" />
    </G>
  </Frame>
);

export const CrimpIcon: React.FC<IconProps> = ({ size, color = '#FFFFFF', strokeWidth = 1.6 }) => (
  <Frame size={size}>
    <G {...stroke(color, strokeWidth)}>
      {/* Thin edge with lip */}
      <Path d="M 4 22 L 28 22" />
      <Path d="M 5 22 L 5 26" />
      <Path d="M 27 22 L 27 26" />
      {/* 4 fingers crimped (bent at knuckle) */}
      <Path d="M 9 6 L 9 14 L 11 19 L 11 22" />
      <Path d="M 14 6 L 14 14 L 16 19 L 16 22" />
      <Path d="M 19 6 L 19 14 L 21 19 L 21 22" />
      <Path d="M 24 6 L 24 14 L 25 19 L 25 22" />
    </G>
  </Frame>
);

export const OpenHandIcon: React.FC<IconProps> = ({ size, color = '#FFFFFF', strokeWidth = 1.6 }) => (
  <Frame size={size}>
    <G {...stroke(color, strokeWidth)}>
      {/* Medium edge */}
      <Path d="M 3 22 L 29 22" />
      <Path d="M 4 22 L 4 25" />
      <Path d="M 28 22 L 28 25" />
      {/* 4 fingers extended straight */}
      <Path d="M 8 6 L 8 22" />
      <Path d="M 13 5 L 13 22" />
      <Path d="M 18 5 L 18 22" />
      <Path d="M 23 6 L 23 22" />
    </G>
  </Frame>
);

export const PinchIcon: React.FC<IconProps> = ({ size, color = '#FFFFFF', strokeWidth = 1.6 }) => (
  <Frame size={size}>
    <G {...stroke(color, strokeWidth)}>
      {/* Vertical pillar */}
      <Path d="M 13 4 L 13 28" />
      <Path d="M 19 4 L 19 28" />
      {/* Thumb left */}
      <Path d="M 7 15 Q 10 16 13 16" />
      {/* 3 fingers right */}
      <Path d="M 25 11 Q 22 12 19 12" />
      <Path d="M 25 16 Q 22 17 19 17" />
      <Path d="M 25 21 Q 22 22 19 22" />
    </G>
  </Frame>
);

export const SloperIcon: React.FC<IconProps> = ({ size, color = '#FFFFFF', strokeWidth = 1.6 }) => (
  <Frame size={size}>
    <G {...stroke(color, strokeWidth)}>
      {/* Wide flat dome */}
      <Path d="M 2 26 Q 16 14 30 26" />
      {/* Palm sweeping across the top */}
      <Path d="M 5 19 Q 16 11 27 19" />
      {/* 4 finger nubs hanging down to dome */}
      <Path d="M 8 18 L 8 22" />
      <Path d="M 13 16 L 13 20" />
      <Path d="M 19 16 L 19 20" />
      <Path d="M 24 18 L 24 22" />
    </G>
  </Frame>
);

export const ThreeFingerDragIcon: React.FC<IconProps> = ({
  size,
  color = '#FFFFFF',
  strokeWidth = 1.6,
}) => (
  <Frame size={size}>
    <G {...stroke(color, strokeWidth)}>
      {/* Edge */}
      <Path d="M 5 22 L 27 22" />
      <Path d="M 6 22 L 6 25" />
      <Path d="M 26 22 L 26 25" />
      {/* 3 straight fingers center */}
      <Path d="M 11 5 L 11 22" />
      <Path d="M 16 5 L 16 22" />
      <Path d="M 21 5 L 21 22" />
      {/* Curled pinky right */}
      <Path d="M 25 10 Q 25 14 23 15 Q 25 16 24 19" />
    </G>
  </Frame>
);

export const TwoFingerDragIcon: React.FC<IconProps> = ({
  size,
  color = '#FFFFFF',
  strokeWidth = 1.6,
}) => (
  <Frame size={size}>
    <G {...stroke(color, strokeWidth)}>
      {/* Small edge */}
      <Path d="M 7 22 L 25 22" />
      <Path d="M 8 22 L 8 25" />
      <Path d="M 24 22 L 24 25" />
      {/* 2 straight fingers */}
      <Path d="M 13 5 L 13 22" />
      <Path d="M 18 5 L 18 22" />
      {/* Curled fingers */}
      <Path d="M 9 11 Q 9 14 11 15 Q 9 16 10 19" />
      <Path d="M 22 11 Q 22 14 20 15 Q 22 16 21 19" />
    </G>
  </Frame>
);

export const TwoFingerPocketIcon: React.FC<IconProps> = ({
  size,
  color = '#FFFFFF',
  strokeWidth = 1.6,
}) => (
  <Frame size={size}>
    <G {...stroke(color, strokeWidth)}>
      {/* Organic rock outline */}
      <Path d="M 3 27 Q 2 16 8 13 Q 16 9 22 12 Q 30 16 29 27" />
      {/* Pocket hole */}
      <Circle cx="16" cy="18" r="4" />
      {/* 2 fingers entering hole */}
      <Path d="M 14 5 L 14 17" />
      <Path d="M 18 5 L 18 17" />
    </G>
  </Frame>
);

// ---------- UI / BRAND ICONS ----------

export const ClimberIcon: React.FC<IconProps> = ({ size, color = '#FFFFFF', strokeWidth = 1.6 }) => (
  <Frame size={size}>
    <G {...stroke(color, strokeWidth)}>
      {/* Head */}
      <Circle cx="13" cy="7" r="2.4" />
      {/* Torso */}
      <Path d="M 13 9.4 L 14 18" />
      {/* Reaching arm up-right to hold */}
      <Path d="M 13.5 11 L 22 5" />
      {/* Other arm across body */}
      <Path d="M 13.5 13 L 8 17" />
      {/* Bent leg right */}
      <Path d="M 14 18 L 18 22 L 18 27" />
      {/* Bent leg left */}
      <Path d="M 14 18 L 9 22 L 11 27" />
      {/* Holds (small dots) */}
      <Circle cx="22.5" cy="4.5" r="0.9" fill={color} />
      <Circle cx="7.5" cy="17.5" r="0.9" fill={color} />
    </G>
  </Frame>
);

export const BoulderIcon: React.FC<IconProps> = ({ size, color = '#FFFFFF', strokeWidth = 1.6 }) => (
  <Frame size={size}>
    <G {...stroke(color, strokeWidth)}>
      {/* Bottom large rock */}
      <Path d="M 3 27 Q 2 20 7 19 Q 16 17 22 20 Q 30 22 29 27 Z" />
      {/* Top smaller rock */}
      <Path d="M 9 19 Q 9 13 13 12 Q 20 11 21 15 Q 21 19 17 19" />
      {/* Crack detail on bottom rock */}
      <Path d="M 12 22 L 14 24" />
    </G>
  </Frame>
);

export const MountainIcon: React.FC<IconProps> = ({ size, color = '#FFFFFF', strokeWidth = 1.6 }) => (
  <Frame size={size}>
    <G {...stroke(color, strokeWidth)}>
      {/* Back peak */}
      <Path d="M 14 14 L 19 6 L 25 16" />
      {/* Front main peak */}
      <Path d="M 3 26 L 12 10 L 19 21 L 24 14 L 29 26" />
      {/* Snow notch on main peak */}
      <Path d="M 10 14 L 12 12 L 14 15" />
    </G>
  </Frame>
);

export const HistoryIcon: React.FC<IconProps> = ({ size, color = '#FFFFFF', strokeWidth = 1.6 }) => (
  <Frame size={size}>
    <G {...stroke(color, strokeWidth)}>
      {/* Axes */}
      <Path d="M 6 6 L 6 26 L 26 26" />
      {/* Ascending progress bars */}
      <Path d="M 11 26 L 11 20" />
      <Path d="M 16 26 L 16 16" />
      <Path d="M 21 26 L 21 10" />
    </G>
  </Frame>
);

// ---------- HOLD LOOKUP ----------

export const HOLD_ICON_COMPONENTS: Record<HoldType, React.FC<IconProps>> = {
  'Jug': JugIcon,
  'Crimp': CrimpIcon,
  'Open Hand': OpenHandIcon,
  'Pinch': PinchIcon,
  'Sloper': SloperIcon,
  '3 Finger Drag': ThreeFingerDragIcon,
  '2 Finger Drag': TwoFingerDragIcon,
  '2 Finger Pocket': TwoFingerPocketIcon,
};

export const HoldIcon: React.FC<IconProps & { type: HoldType }> = ({
  type,
  ...rest
}) => {
  const Icon = HOLD_ICON_COMPONENTS[type];
  return <Icon {...rest} />;
};
