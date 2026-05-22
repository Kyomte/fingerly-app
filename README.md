# Fingerly

A focused hangboard (fingerboard) interval timer for rock climbers. Built with React Native and Expo.

Fingerly provides structured workout sessions with hold-type guidance, set tracking, rest countdowns, and preset routines for common training protocols — designed to be glanceable mid-hang with chalk-covered hands.

---

## Features

- **Workout Builder** — Create custom routines with configurable hang time, rest time, and set counts
- **Preset Routines** — Save and reuse common training protocols (repeaters, max-hang, etc.)
- **Active Timer** — Full-screen countdown with phase indicators and haptic feedback
- **Dark-first UI** — Built for gym lighting and active use; no visual noise

---

## Requirements

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (Mac) or Android Emulator, or a physical device with the Expo Go app

---

## Installation

```bash
# Clone the repo
git clone https://github.com/Kyomte/Fingerly.git
cd Fingerly

# Install dependencies
npm install
```

---

## Running the App

### Start the development server

```bash
npm start
```

This opens the Expo dev menu. From there you can:

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with [Expo Go](https://expo.dev/go) on your phone

### Run directly on a simulator

```bash
# iOS (Mac only)
npm run ios

# Android
npm run android
```

---

## How to Use

### 1. Build a Workout

Open the **Workout** tab. Tap **Add Exercise** to add a hang set. For each exercise you can configure:

- **Hold type** — the grip or hold position
- **Hang duration** — how long you hang (seconds)
- **Rest duration** — rest between sets (seconds)
- **Sets** — number of sets

Tap an exercise card to expand and edit it. Drag to reorder.

### 2. Save as a Preset

Once your workout is configured, save it as a preset from the **Presets** tab so you can reload it next session without rebuilding it.

### 3. Start the Timer

Tap **Start Workout** to launch the full-screen timer. The screen shows:

- Current phase (HANG / REST)
- Countdown in large type
- Current set and total sets

Haptic feedback fires on phase transitions so you don't have to watch the screen during a hang.

Tap anywhere to pause. Tap again to resume.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | [Expo](https://expo.dev) ~54 / React Native 0.81 |
| Navigation | React Navigation (native stack + bottom tabs) |
| Animations | React Native Reanimated 4 |
| Storage | AsyncStorage |
| Audio / Haptics | expo-av, expo-haptics |
| Icons | react-native-svg (custom SVG components) |
| Language | TypeScript |

---

## Project Structure

```
src/
  screens/        # WorkoutScreen, PresetsScreen, TimerScreen
  components/     # Shared UI components and icons
  context/        # RoutinesProvider (global workout state)
  theme/          # Colors, spacing, typography constants
  types/          # TypeScript types and navigation params
assets/           # App icons, splash screen
```

---

## Contributing

1. Fork the repo and create a feature branch
2. Make your changes
3. Open a pull request against `main`

Please keep the UI consistent with the existing dark theme and minimal design language — no gamification, no loud gradients.

---

## License

MIT
