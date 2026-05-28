import React from 'react';
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  edges?: readonly Edge[];
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  style,
  contentContainerStyle,
  edges = ['top', 'right', 'left'],
}) => {
  if (!scroll) {
    return (
      <SafeAreaView edges={edges} style={[styles.safeArea, style]}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, style]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
