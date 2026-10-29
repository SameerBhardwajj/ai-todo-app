import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

import { styles } from './styles';

type ActionButtonProps = {
  accessibilityLabel?: string;
  disabled?: boolean;
  label: string;
  onPress: () => void;
  size?: 'regular' | 'compact';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant: 'primary' | 'secondary' | 'danger';
};

export function ActionButton({
  accessibilityLabel,
  disabled = false,
  label,
  onPress,
  size = 'regular',
  style,
  textStyle,
  variant,
}: ActionButtonProps) {
  const compact = size === 'compact';

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        compact && styles.compact,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          compact && styles.compactLabel,
          variant === 'secondary' && styles.secondaryLabel,
          variant === 'danger' && styles.dangerLabel,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}