import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { testDeepLinks, testDeepLinkParsing, generateProductLink } from '../../utils/deepLinks';

interface DeepLinkTesterProps {
  visible?: boolean;
}

export const DeepLinkTester: React.FC<DeepLinkTesterProps> = ({ visible = false }) => {
  if (!visible) return null;

  const handleTestDeepLink = () => {
    testDeepLinks();
    Alert.alert('Deep Link Test', 'Check console for test results');
  };

  const handleTestParsing = () => {
    testDeepLinkParsing();
    Alert.alert('Parsing Test', 'Check console for parsing test results');
  };

  const handleTestProductLink = () => {
    const link = generateProductLink('123');
    Alert.alert('Product Deep Link', `Generated: ${link}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deep Link Tester</Text>
      <Text style={styles.subtitle}>Development Only</Text>
      
      <TouchableOpacity style={styles.testButton} onPress={handleTestParsing}>
        <Text style={styles.buttonText}>Test URL Parsing</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.testButton} onPress={handleTestDeepLink}>
        <Text style={styles.buttonText}>Test Full Deep Links</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.testButton} onPress={handleTestProductLink}>
        <Text style={styles.buttonText}>Generate Product Link</Text>
      </TouchableOpacity>
      
      <Text style={styles.info}>
        Test deep links by opening these URLs in your browser or another app:
        {'\n\n'}
        • flydubaiecommerceapp://product/123
        {'\n'}
        • flydubaiecommerceapp://favorites
        {'\n'}
        • flydubaiecommerceapp://
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.md,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  
  subtitle: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginBottom: SPACING.md,
  },
  
  testButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  
  buttonText: {
    color: COLORS.background,
    fontWeight: '600',
  },
  
  info: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: SPACING.sm,
  },
});
