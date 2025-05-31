import './global.css';

import { StatusBar } from 'expo-status-bar';
import { View, SafeAreaView, Text, TouchableOpacity, Platform } from 'react-native';
import { useState } from 'react';
import CurvedScrollBar from './components/CurvedScrollBar';

export default function App() {
  const [scrollBarColor, setScrollBarColor] = useState('#f6a53b'); // Orange by default
  const [showRail, setShowRail] = useState(true);

  const changeColor = () => {
    // Toggle between orange and red
    setScrollBarColor((prev) => (prev === '#f6a53b' ? '#dd2f2f' : '#f6a53b'));
  };

  const toggleRail = () => {
    setShowRail((prev) => !prev);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950 ">
      <CurvedScrollBar
        backgroundColor=""
        scrollBarColor={scrollBarColor}
        scrollBarWidth={5}
        showRail={showRail}>
        <View className="flex-1 bg-zinc-950 px-6 py-6">
          {/* Modern Header */}
          <View className="mb-8">
            <Text className="mb-2 text-3xl font-bold text-white">Curved Scrollbar</Text>
            <Text className="text-base text-gray-400">Modern interface with custom scrollbar</Text>
          </View>

          {/* Elegant Controls */}
          <View className="mb-8 flex-row gap-3">
            <TouchableOpacity
              onPress={changeColor}
              className="flex-1 rounded-2xl border border-gray-700 bg-gray-800/50 px-6 py-4">
              <Text className="mb-1 text-center font-semibold text-white">Color</Text>
              <Text className="text-center text-sm text-gray-400">
                {scrollBarColor === '#f6a53b' ? 'Orange' : 'Red'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleRail}
              className="flex-1 rounded-2xl border border-gray-700 bg-gray-800/50 px-6 py-4">
              <Text className="mb-1 text-center font-semibold text-white">Rail</Text>
              <Text className="text-center text-sm text-gray-400">
                {showRail ? 'Enabled' : 'Disabled'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Modern Content */}
          <View className="space-y-6">
            {/* Hero Section */}
            <View className="mb-8 rounded-3xl border border-orange-800/30 bg-gradient-to-br from-orange-900/20 to-orange-900/40 p-8">
              <Text className="mb-4 text-2xl font-bold text-white">✨ Modern Scrollbar</Text>
              <Text className="leading-relaxed text-gray-300">
                An elegant scrollbar that perfectly follows screen contours with fluid transitions
                and clean design.
              </Text>
            </View>

            {/* Content Cards */}
            <View className="flex-1 gap-4">
              {Array.from({ length: 20 }, (_, i) => (
                <View key={i} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
                  <View className="mb-3 flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-white">Article {i + 1}</Text>
                    <View
                      className="h-2 w-2 animate-pulse rounded-full bg-orange-500"
                      style={[
                        Platform.select({
                          ios: {
                            shadowColor: '#f97316',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.8,
                            shadowRadius: 8,
                          },
                          default: {}, // web aussi
                        }),
                        Platform.OS === 'android' && { elevation: 8 },
                      ]}></View>
                  </View>
                  <Text className="leading-relaxed text-gray-400">
                    Discover how this scrollbar perfectly follows the path along screen edges with
                    smooth and modern animation.
                  </Text>
                </View>
              ))}
            </View>
            {/* Final Section */}
            <View className="mb-8 rounded-3xl  p-8">
              <Text className="mb-4 text-2xl font-bold text-white">🎯 End of Journey</Text>
              <Text className="leading-relaxed text-gray-300">
                You have reached the end of the content. The scrollbar has followed the entire path
                with elegance!
              </Text>
            </View>
          </View>
        </View>
      </CurvedScrollBar>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
