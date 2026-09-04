import {StyleSheet, Text, View} from 'react-native';
import {Note} from '../types/Note';

type NoteItemProps = {
  note: Note;
};

export function NoteItem({note}: NoteItemProps) {
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

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    color: '#6B7280',
  },
});
