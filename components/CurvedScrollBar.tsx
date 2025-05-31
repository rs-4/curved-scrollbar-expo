import React, { useState, useRef } from 'react';
import { View, ScrollView, LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';

interface CurvedScrollBarProps {
  children: React.ReactNode;
  backgroundColor?: string;
  scrollBarColor?: string;
  scrollBarWidth?: number;
  showRail?: boolean;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const CurvedScrollBar: React.FC<CurvedScrollBarProps> = ({
  children,
  backgroundColor = '#000000',
  scrollBarColor = '#FF0000',
  scrollBarWidth = 8,
  showRail = true,
}) => {
  // ================================================================================================
  // CONFIGURATION SECTION - Easily adjustable parameters for customization
  // ================================================================================================

  /**
   * Scrollbar visual configuration
   * Adjust these values to customize the appearance and behavior of the curved scrollbar
   */
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
      damping: 30, // Higher = less bouncy, lower = more bouncy
      stiffness: 500, // Higher = faster animation, lower = slower animation
    },

    // Opacity when scrollbar is inactive (content fits in viewport)
    inactiveOpacity: 0.3,
  };

  // ================================================================================================
  // STATE MANAGEMENT - Component state and refs
  // ================================================================================================

  // Container dimensions to calculate the curved path
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Content measurements for determining if scrollbar should be visible
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  // Animated scroll progress value (0 to 1)
  const scrollProgress = useSharedValue(0);

  // Reference to the ScrollView component
  const scrollViewRef = useRef<ScrollView>(null);

  // ================================================================================================
  // EVENT HANDLERS - Layout and scroll event management
  // ================================================================================================

  /**
   * Handles container layout changes to update dimensions for path calculation
   * Called when the component is mounted or screen orientation changes
   */
  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  };

  /**
   * Handles scroll events and updates the animated progress value
   * Normalizes scroll position to a 0-1 range for consistent animation
   */
  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const maxScrollDistance = contentSize.height - layoutMeasurement.height;
    const progress = maxScrollDistance > 0 ? contentOffset.y / maxScrollDistance : 0;

    // Apply spring animation to scroll progress for smooth movement
    scrollProgress.value = withSpring(Math.max(0, Math.min(1, progress)), {
      damping: SCROLLBAR_CONFIG.animation.damping,
      stiffness: SCROLLBAR_CONFIG.animation.stiffness,
    });
  };

  // ================================================================================================
  // PATH CALCULATION - Generate the curved rail path geometry
  // ================================================================================================

  /**
   * Calculates the complete curved rail path that follows screen edges
   * Creates a C-shaped path: horizontal → corner → vertical → corner → horizontal
   *
   * @returns Object containing SVG path string, points array, segment lengths, and total length
   */
  const calculateRailPath = () => {
    // Early return if container hasn't been measured yet
    if (containerDimensions.width === 0 || containerDimensions.height === 0) {
      return { railPath: '', points: [], segmentLengths: [], totalLength: 0 };
    }

    const { cornerRadius, edgePadding, horizontalPosition } = SCROLLBAR_CONFIG;

    // Define the key points of the curved path
    // Each point represents a corner or endpoint of the rail segments
    const points = [
      // 1. Starting point - right side of top edge
      {
        x: containerDimensions.width / horizontalPosition,
        y: edgePadding + cornerRadius,
      },

      // 2. Approach point for top-right corner
      {
        x: containerDimensions.width - edgePadding - cornerRadius,
        y: edgePadding + cornerRadius,
      },

      // 3. Exit point from top-right corner (start of vertical segment)
      {
        x: containerDimensions.width - edgePadding,
        y: edgePadding + cornerRadius + cornerRadius,
      },

      // 4. Approach point for bottom-right corner (end of vertical segment)
      {
        x: containerDimensions.width - edgePadding,
        y: containerDimensions.height - edgePadding - cornerRadius - cornerRadius,
      },

      // 5. Exit point from bottom-right corner (start of bottom horizontal)
      {
        x: containerDimensions.width - edgePadding - cornerRadius,
        y: containerDimensions.height - edgePadding - cornerRadius,
      },

      // 6. End point - right side of bottom edge
      {
        x: containerDimensions.width / horizontalPosition,
        y: containerDimensions.height - edgePadding - cornerRadius,
      },
    ];

    // Calculate segment lengths for uniform speed animation
    // This ensures the scrollbar moves at consistent speed regardless of segment length
    const segmentLengths: number[] = [];
    let totalLength = 0;

    for (let i = 0; i < points.length - 1; i++) {
      let length;

      if (i === 1 || i === 3) {
        // Arc segments: approximate quarter-circle length
        // Adding small offset for better visual timing
        length = (Math.PI * cornerRadius) / 2 + 2;
      } else {
        // Straight line segments: calculate Euclidean distance
        const dx = points[i + 1].x - points[i].x;
        const dy = points[i + 1].y - points[i].y;
        length = Math.sqrt(dx * dx + dy * dy);
      }

      segmentLengths.push(length);
      totalLength += length;
    }

    // Generate SVG path string with proper arc commands
    // Uses move-to, line-to, and arc-to commands for precise geometry
    let railPath = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      if (i === 2) {
        // First arc: top-right corner (horizontal to vertical transition)
        // sweep-flag=1 creates clockwise arc
        railPath += ` A ${cornerRadius} ${cornerRadius} 0 0 1 ${points[i].x} ${points[i].y} `;
      } else if (i === 4) {
        // Second arc: bottom-right corner (vertical to horizontal transition)
        railPath += ` A ${cornerRadius} ${cornerRadius} 0 0 1 ${points[i].x} ${points[i].y}`;
      } else {
        // Straight line segments
        railPath += ` L ${points[i].x} ${points[i].y}`;
      }
    }

    return { railPath, points, segmentLengths, totalLength };
  };

  // Generate the rail geometry
  const railGeometry = calculateRailPath();

  // ================================================================================================
  // ANIMATION PROPS - Configure scrollbar visibility and position animation
  // ================================================================================================

  /**
   * Animated properties for the scrollbar using stroke-dasharray technique
   * This approach reveals only a small portion of the complete rail path
   * creating a moving indicator that perfectly follows the curved track
   */
  const animatedMaskProps = useAnimatedProps(() => {
    // Hide scrollbar when rail is disabled or content fits in viewport
    if (!showRail || contentHeight <= scrollViewHeight || !railGeometry.railPath) {
      return { opacity: 0, strokeDasharray: '0 1000', strokeDashoffset: 0 };
    }

    const progress = scrollProgress.value;
    const { totalLength } = railGeometry;

    // Safety check for valid geometry
    if (totalLength === 0) {
      return { opacity: 0, strokeDasharray: '0 1000', strokeDashoffset: 0 };
    }

    const { visibleLength } = SCROLLBAR_CONFIG;

    // Calculate current position along the complete path
    const currentPosition = progress * totalLength;

    // Create dash pattern: visible segment followed by invisible gap
    // This technique reveals only the desired portion of the path
    const dashArray = `${visibleLength} ${totalLength}`;

    // Offset the dash pattern to position the visible segment
    // Centering the visible segment around the current position
    const dashOffset = -currentPosition + visibleLength / 2;

    return {
      strokeDasharray: dashArray,
      strokeDashoffset: dashOffset,
      opacity: 1,
    };
  });

  // ================================================================================================
  // CONTAINER STYLE ANIMATION - Overall scrollbar opacity
  // ================================================================================================

  /**
   * Animated style for the entire scrollbar container
   * Provides visual feedback when scrollbar is active vs inactive
   */
  const animatedContainerStyle = useAnimatedStyle(() => {
    const isScrollable = contentHeight > scrollViewHeight;
    return {
      opacity: isScrollable ? 1 : SCROLLBAR_CONFIG.inactiveOpacity,
    };
  });

  // ================================================================================================
  // RENDER - Component JSX structure
  // ================================================================================================

  return (
    <View style={{ flex: 1, backgroundColor }}>
      {/* Main container with layout detection */}
      <View style={{ flex: 1 }} onLayout={handleContainerLayout}>
        {/* Scrollable content area */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          onScroll={handleScroll}
          scrollEventThrottle={16} // 60fps scroll events for smooth animation
          showsVerticalScrollIndicator={false} // Hide default scrollbar
          onContentSizeChange={(width, height) => setContentHeight(height)}
          onLayout={(event) => setScrollViewHeight(event.nativeEvent.layout.height)}>
          {/* Wrapped content */}
          <View>{children}</View>
        </ScrollView>

        {/* Curved scrollbar overlay */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              width: containerDimensions.width,
              height: containerDimensions.height,
              pointerEvents: 'none', // Allow touch events to pass through
            },
            animatedContainerStyle,
          ]}>
          <Svg width={containerDimensions.width} height={containerDimensions.height}>
            {/* Animated path with dash-based visibility */}
            {showRail && railGeometry.railPath && (
              <AnimatedPath
                d={railGeometry.railPath}
                stroke={scrollBarColor}
                strokeWidth={scrollBarWidth}
                strokeLinecap="round" // Rounded ends for visual appeal
                fill="none"
                animatedProps={animatedMaskProps}
              />
            )}
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
};

export default CurvedScrollBar;
