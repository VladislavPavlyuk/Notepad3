import {useEffect, useState} from 'react';
import {
  Alert,
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
import {
  exportNotesToJson,
  importNotesFromJson,
} from '../database/notesTransfer';
import {RootStackParamList} from '../navigation/AppNavigator';
import {Note} from '../types/Note';

type Props = NativeStackScreenProps<RootStackParamList, 'Notes'>;

export default function NotesScreen({navigation}: Props) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadNotes = async () => {
      await initDatabase();
      const list = await getAllNotes();
      if (!cancelled) {
        setNotes(list);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadNotes().catch(error => {
        console.error('Failed to load notes', error);
      });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [navigation]);

  const handleExport = async () => {
    try {
      const saved = await exportNotesToJson();
      if (saved) {
        Alert.alert('Export', 'Notes exported to JSON.');
      }
    } catch (error) {
      console.error('Failed to export notes', error);
      Alert.alert('Export failed', 'Could not export notes.');
    }
  };

  const handleImport = async () => {
    try {
      const imported = await importNotesFromJson();
      if (imported) {
        setNotes(imported);
        Alert.alert('Import', `Imported ${imported.length} notes.`);
      }
    } catch (error) {
      console.error('Failed to import notes', error);
      Alert.alert('Import failed', 'Could not import notes from JSON.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Pressable style={styles.toolbarButton} onPress={handleExport}>
          <Text style={styles.toolbarButtonText}>Export</Text>
        </Pressable>
        <Pressable style={styles.toolbarButton} onPress={handleImport}>
          <Text style={styles.toolbarButtonText}>Import</Text>
        </Pressable>
      </View>
      <FlatList
        data={notes}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <Pressable
            onPress={() => navigation.navigate('NoteDetails', {id: item.id})}>
            <NoteItem note={item} />
          </Pressable>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes yet</Text>
        }
      />

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('NoteEditor')}>
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
  toolbar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  toolbarButton: {
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  toolbarButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
