import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

interface IconProps {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  size?: number;
  color?: string;
  style?: any;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000', style }) => {
  // Map common icon names to FontAwesome equivalents
  const iconMap: Record<string, React.ComponentProps<typeof FontAwesome>['name']> = {
    'heart': 'heart',
    'heart-o': 'heart-o',
    'shopping-bag': 'shopping-bag',
    'arrow-left': 'arrow-left',
    'share': 'share',
    'home': 'home',
    'code': 'code',
  };

  const iconName = iconMap[name] || name;

  return <FontAwesome name={iconName} size={size} color={color} style={style} />;
};
