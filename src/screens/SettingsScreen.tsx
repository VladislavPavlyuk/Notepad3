import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMemo} from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {
  THEME_STORAGE_KEY,
  ThemeColors,
  useAppTheme,
} from '../theme/ThemeContext';

export default function SettingsScreen() {
  const {isDark, colors, setDarkTheme} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const onThemeChange = (value: boolean) => {
    setDarkTheme(value);
    AsyncStorage.setItem(THEME_STORAGE_KEY, value ? 'dark' : 'light').catch(
      error => {
        console.error('Failed to save theme', error);
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Dark theme</Text>
        <Switch
          value={isDark}
          onValueChange={onThemeChange}
          trackColor={{false: colors.switchTrackOff, true: colors.primary}}
          thumbColor={colors.onPrimary}
          ios_backgroundColor={colors.switchTrackOff}
        />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
  });
