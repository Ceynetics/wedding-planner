import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: Props) {
  const { theme } = useAppTheme();
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.error + '15' }]}>
      <Ionicons name="alert-circle" size={20} color={colors.error} />
      <Text style={[styles.message, { color: colors.error }]}>{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={[styles.retryButton, { borderColor: colors.error }]}>
          <Text style={[styles.retryText, { color: colors.error }]}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 8,
  },
  message: {
    flex: 1,
    fontSize: 13,
  },
  retryButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
