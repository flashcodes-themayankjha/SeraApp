#!/usr/bin/env bash

set -e

PROJECT="sera"

echo "🚀 Setting up Sera monorepo..."


# -------------------------
# App internal structure
# -------------------------
mkdir -p app/src/{navigation,screens,components,services,store,hooks,theme,utils,assets}
mkdir -p app/src/assets/{icons,lottie,sounds}

# Navigation
touch app/src/navigation/RootNavigator.tsx

# Screens
touch app/src/screens/DiscoveryScreen.tsx
touch app/src/screens/DashboardScreen.tsx
touch app/src/screens/EmotionScreen.tsx
touch app/src/screens/ServoCalibrationScreen.tsx
touch app/src/screens/SoundManagerScreen.tsx
touch app/src/screens/OTAUpdateScreen.tsx
touch app/src/screens/SettingsScreen.tsx

# Components
touch app/src/components/EmotionButton.tsx
touch app/src/components/ServoSlider.tsx
touch app/src/components/ConnectionStatus.tsx
touch app/src/components/BatteryRing.tsx
touch app/src/components/RobotAvatar.tsx

# Services
touch app/src/services/robotWebSocket.ts
touch app/src/services/robotRestApi.ts
touch app/src/services/discovery.ts
touch app/src/services/ota.ts

# Store
touch app/src/store/robotStore.ts
touch app/src/store/appStore.ts

# Hooks
touch app/src/hooks/useRobot.ts
touch app/src/hooks/useTelemetry.ts
touch app/src/hooks/useConnection.ts

# Theme
touch app/src/theme/colors.ts
touch app/src/theme/spacing.ts
touch app/src/theme/typography.ts
touch app/src/theme/index.ts

# Utils
touch app/src/utils/types.ts
touch app/src/utils/constants.ts
touch app/src/utils/validators.ts

echo ""
echo "✅ Sera project structure created successfully!"
echo ""
echo "📁 Root:"
echo "   sera/"
echo "   ├── app/        (React Native)"
echo "   ├── firmware/   (ESP32)"
echo "   ├── backend/    (LLM / Agents)"
echo "   ├── shared/     (Protocols)"
echo "   └── docs/"
echo ""
echo "👉 Next: run 'cd app && npx create-expo-app .' OR start filling files"
