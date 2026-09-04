import {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ThemeColors, useAppTheme} from '../theme/ThemeContext';
import {Note} from '../types/Note';

type NoteItemProps = {
  note: Note;
};

export function NoteItem({note}: NoteItemProps) {
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const formattedDate = new Date(note.updatedAt).toLocaleString();

  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={1}>
        {note.title}
      </Text>
      <Text style={styles.date}>{formattedDate}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 10,
    },
    title: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    date: {
      fontSize: 13,
      color: colors.textSecondary,
    },
  });
