import {TextInput, TextInputProps} from 'react-native';
import {useAppTheme} from '../theme/ThemeContext';

export function ThemedTextInput(props: TextInputProps) {
  const {colors, isDark} = useAppTheme();

  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.textMuted}
      cursorColor={colors.primary}
      selectionColor={colors.selection}
      keyboardAppearance={isDark ? 'dark' : 'light'}
    />
  );
}
