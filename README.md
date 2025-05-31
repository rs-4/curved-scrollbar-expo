# CurvedScrollBar Component

A modern React Native component that provides a curved scrollbar that elegantly follows screen edges, similar to premium mobile interfaces with smooth animations and customizable appearance.

## ✨ Features

- 🚀 **Curved Path**: C-shaped scrollbar that follows screen contours (horizontal → corner → vertical → corner → horizontal)
- 🎬 **Smooth Animations**: Built with React Native Reanimated for 60fps performance using stroke-dasharray technique
- 📱 **Cross-platform**: Works on iOS, Android, and Web
- 🎯 **Dynamic Positioning**: Scrollbar position follows content scroll progress with uniform speed
- 🔧 **Highly Configurable**: Easy-to-modify configuration section with visual parameters
- ⌨️ **Touch-through**: Overlay doesn't interfere with content interaction
- 🎨 **Modern UI**: Clean design with customizable colors and opacity
- 📝 **TypeScript**: Fully typed with comprehensive documentation

## 🛠️ Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| **iOS** | ✅ Full Support | Native SVG rendering, smooth animations |
| **Android** | ✅ Full Support | Native SVG rendering, smooth animations |
| **Web** | ✅ Full Support | SVG animations, scroll event handling |

## 📋 Requirements

| Dependency | Version | Required |
|------------|---------|----------|
| **Expo SDK** | 53.0.0+ | ✅ |
| **React Native** | 0.79+ | ✅ |
| **React Native Reanimated** | 3.17+ | ✅ |
| **React Native SVG** | 15.11+ | ✅ |
| **Tailwind CSS (NativeWind)** | Latest | ✅ |
| **TypeScript** | 5.8+ | ✅ |

## 🚀 Installation

```bash
# Install core dependencies
npm install react-native-reanimated react-native-svg

# Install SVG support for Expo
npx expo install react-native-svg
```

## 📖 Usage

```tsx
import CurvedScrollBar from './components/CurvedScrollBar';

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <CurvedScrollBar
        backgroundColor="#000000"
        scrollBarColor="#f6a53b"
        scrollBarWidth={5}
        showRail={true}
      >
        <View className="flex-1 px-6 py-6">
          {/* Your scrollable content here */}
          {Array.from({ length: 20 }, (_, i) => (
            <View key={i} className="p-4 mb-4 bg-gray-800 rounded-lg">
              <Text className="text-white">Article {i + 1}</Text>
            </View>
          ))}
        </View>
      </CurvedScrollBar>
    </SafeAreaView>
  );
}
```

## 🎛️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | `undefined` | Content to be wrapped with curved scrollbar |
| `backgroundColor` | `string` | `"#000000"` | Background color of the container |
| `scrollBarColor` | `string` | `"#FF0000"` | Color of the scrollbar indicator |
| `scrollBarWidth` | `number` | `4` | Width/thickness of the scrollbar stroke |
| `showRail` | `boolean` | `true` | Whether to show the scrollbar (can be toggled dynamically) |

## ⚙️ Configuration

The component includes a comprehensive configuration section that you can easily modify:

```typescript
const SCROLLBAR_CONFIG = {
  // Corner radius for the curved sections (in pixels)
  // Smaller values = tighter corners, larger values = more rounded corners
  cornerRadius: 12,
  
  // Distance from screen edges (in pixels)
  // Smaller values = closer to edges, larger values = more inset from edges
  edgePadding: 10,
  
  // Horizontal position of the start/end points
  // 1.0 = center, 1.1 = slightly right of center, 1.2 = more right, etc.
  horizontalPosition: 1.1,
  
  // Length of the visible scrollbar segment (in pixels)
  // Longer values = more visible track, shorter values = smaller indicator
  visibleLength: 70,
  
  // Animation spring configuration for smooth scrolling
  animation: {
    damping: 30,      // Higher = less bouncy, lower = more bouncy
    stiffness: 500,   // Higher = faster animation, lower = slower animation
  },
  
  // Opacity when scrollbar is inactive (content fits in viewport)
  inactiveOpacity: 0.3,
};
```

## ⚙️ How it works

### Path Generation
- Creates a C-shaped SVG path with 6 key points
- Uses SVG Arc commands for smooth 90° corners
- Calculates segment lengths for uniform animation speed
- Responsive to container dimensions

### Animation System
- **stroke-dasharray technique**: Reveals only a small portion of the complete path
- **Uniform speed**: Scrollbar moves consistently regardless of path segment
- **Spring animations**: Smooth, natural feeling using Reanimated's withSpring
- **Real-time positioning**: Updates at 60fps with scrollEventThrottle

### Path Segments
1. **Horizontal Top**: From center-right to top-right corner approach
2. **Arc Top-Right**: 90° clockwise turn from horizontal to vertical
3. **Vertical Right**: Along the right edge of the screen
4. **Arc Bottom-Right**: 90° clockwise turn from vertical to horizontal
5. **Horizontal Bottom**: From bottom-right corner to center-right

## 🎨 Styling & Customization

### Quick Color Changes
```tsx
// Orange scrollbar
<CurvedScrollBar scrollBarColor="#f6a53b" />

// Red scrollbar
<CurvedScrollBar scrollBarColor="#dd2f2f" />

// Custom thickness
<CurvedScrollBar scrollBarWidth={8} />
```

### Advanced Customization
Modify the `SCROLLBAR_CONFIG` object inside the component:

```typescript
// Tighter corners
cornerRadius: 8,

// Closer to edges
edgePadding: 5,

// More towards center
horizontalPosition: 1.0,

// Longer indicator
visibleLength: 100,

// Faster animation
animation: {
  damping: 20,
  stiffness: 800,
}
```

## 🔧 Technical Details

### SVG Path Structure
```
M startX startY              // Move to starting point
L cornerApproachX cornerApproachY    // Line to corner approach
A radius radius 0 0 1 cornerExitX cornerExitY    // Arc through corner
L verticalEndX verticalEndY  // Line along edge
A radius radius 0 0 1 finalCornerX finalCornerY  // Final corner arc
L endX endY                  // Line to end point
```

### Performance Optimizations
- **Memoized calculations**: Path only recalculates on dimension changes
- **Efficient animations**: Uses native driver for 60fps performance
- **Touch optimization**: `pointerEvents="none"` prevents interaction interference
- **Conditional rendering**: Only renders when content is scrollable

## 📱 Integration Examples

### With Color Toggle
```tsx
const [scrollBarColor, setScrollBarColor] = useState('#f6a53b');

const toggleColor = () => {
  setScrollBarColor(prev => prev === '#f6a53b' ? '#dd2f2f' : '#f6a53b');
};

<CurvedScrollBar scrollBarColor={scrollBarColor}>
  {/* Content */}
</CurvedScrollBar>
```

### With Dynamic Rail Toggle
```tsx
const [showRail, setShowRail] = useState(true);

<CurvedScrollBar showRail={showRail}>
  {/* Content */}
</CurvedScrollBar>
```

## 🐛 Troubleshooting

### Common Issues

#### Scrollbar Not Visible
- **Check content height**: Scrollbar only appears when content exceeds viewport
- **Verify showRail prop**: Ensure it's set to `true`
- **Check colors**: Ensure scrollBarColor contrasts with background

#### Performance Issues
- **Reduce visibleLength**: Shorter indicators render faster
- **Increase damping**: Higher values = less spring calculations
- **Check scrollEventThrottle**: Should be 16 for 60fps

#### Layout Issues
- **Container dimensions**: Component needs measured container to calculate path
- **SafeAreaView**: Wrap in SafeAreaView for proper edge handling
- **Flex layout**: Ensure parent has `flex: 1`

## 🌐 Web Support

Works seamlessly on web with:
- SVG rendering support
- Mouse wheel scroll events
- Touch scroll on mobile browsers
- Responsive design

## 🤝 Contributing

When contributing:
1. Test on iOS, Android, and Web
2. Ensure animations are smooth (60fps)
3. Update configuration documentation
4. Test with various content sizes
5. Verify edge cases (very short/long content)

## 📚 API Reference

### Component Methods
- Path calculation is automatic
- No exposed methods (fully self-contained)
- Responds to scroll events automatically

### Configuration Options
All customization happens through the `SCROLLBAR_CONFIG` object within the component.

## 📄 License

MIT License - feel free to use in your projects!

---

Built with ❤️ using React Native Reanimated, SVG, and modern animation techniques
