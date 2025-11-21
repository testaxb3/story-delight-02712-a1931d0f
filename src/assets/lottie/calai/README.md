# CalAI Lottie Animations

Premium animations imported from CalAI app for use in NEP System.

## Available Animations

### Progress & Transitions
- **`your_weight_transition_dark.json`** - Weight/progress transition animation (dark mode)
- **`your_weight_transition_light.json`** - Weight/progress transition animation (light mode)
- **`your_weight_dark.json`** - Weight display animation (dark mode)
- **`your_weight_light.json`** - Weight display animation (light mode)

### Celebrations
- **`clap_dark.json`** - Clapping celebration (dark mode)
- **`clap_lightmode.json`** - Clapping celebration (light mode)
- **`finger_heart_dark.json`** - Finger heart gesture (dark mode)
- **`finger_heart_light.json`** - Finger heart gesture (light mode)

### Animal Mascots (Speed/Pace Indicators)
- **`sloth.json`** - Sloth character (slow pace)
- **`rabbit.json`** - Rabbit character (fast pace)
- **`panther.json`** - Panther character (medium pace)

## Usage Example

```tsx
import { LottieIcon } from '@/components/LottieIcon';
import clapDark from '@/assets/lottie/calai/clap_dark.json';

function CelebrationComponent() {
  return (
    <LottieIcon
      animationData={clapDark}
      isActive={true}
      size={120}
      loop={false}
      autoplay={true}
    />
  );
}
```

## Current Integration

### Quiz Components
1. **QuizLoadingScreen** - Uses `your_weight_transition_dark.json` for progress display
2. **QuizMotivationalScreen** - Uses `clap_dark.json` for milestone celebrations
3. **Quiz Result Screen** - Uses `finger_heart_dark.json` for final celebration

## Typography Integration

The **Relative** font family is also available and integrated:
- `font-relative` - Use this Tailwind class for CalAI-inspired typography
- Weights: Book (400), Medium (500), Bold (700)

Example:
```tsx
<h1 className="font-relative font-bold text-9xl">
  100%
</h1>
```
