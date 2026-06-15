# SoberShield

Clean Expo SDK 54 mobile app scaffold for Expo Go, built with React Native, TypeScript, and expo-router.

## Stack
- Expo SDK 54
- React Native 0.81
- React 19.1
- Expo Router v6
- TypeScript

## Recommended local setup
- Node.js 20.19.x or newer in the 20.x line
- npm install
- npx expo start

## Install commands
```bash
npm install
npx expo start
```

## Useful commands
```bash
npm run start
npm run android
npm run ios
npm run web
```

## Project structure
```text
.gitignore
app/
  (public)/
    _layout.tsx
    calibration.tsx
    login.tsx
    onboarding.tsx
    signup.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    journal.tsx
    progress.tsx
    settings.tsx
    support.tsx
  _layout.tsx
  index.tsx
  support/
    achievements.tsx
    breathing.tsx
    check-in.tsx
    craving-log.tsx
    emergency.tsx
    grounding.tsx
    history.tsx
    profile.tsx
    streak.tsx
app.json
assets/
babel.config.js
components/
  AchievementCard.tsx
  AppBackground.tsx
  AppButton.tsx
  AppTextInput.tsx
  BreathingCircle.tsx
  Chip.tsx
  EntryCard.tsx
  GlassCard.tsx
  QuickActionCard.tsx
  Screen.tsx
  SectionHeader.tsx
  StatCard.tsx
constants/
  theme.ts
context/
  AppContext.tsx
data/
  mockData.ts
expo-env.d.ts
package.json
tsconfig.json
types/
  index.ts
```

## Notes
- Uses only Expo Go friendly packages.
- Uses mock data and local React state for a stable starter.
- No custom dev client required.
- No native linking required.
- Auth and recovery flows are mocked for now so you can run the UI immediately.
