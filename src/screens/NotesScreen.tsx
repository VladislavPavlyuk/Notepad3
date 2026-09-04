import {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NoteItem} from '../components/NoteItem';
import {initDatabase} from '../database/db';
import {getAllNotes} from '../database/notesRepository';
import {RootStackParamList} from '../navigation/AppNavigator';
import {Note} from '../types/Note';

type Props = NativeStackScreenProps<RootStackParamList, 'Notes'>;

export default function NotesScreen({navigation}: Props) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await initDatabase();
      const list = await getAllNotes();
      if (!cancelled) {
        setNotes(list);
      }
    })().catch(error => {
      console.error('Failed to load notes', error);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => <NoteItem note={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes yet</Text>
        }
      />

      <Pressable style={styles.addButton} onPress={() => {}}>
        <Text style={styles.addButtonText}>+ Add note</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 15,
    marginTop: 40,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
