import {useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getNoteById, updateNote} from '../database/notesRepository';
import {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteDetails'>;

export default function NoteDetailsScreen({route, navigation}: Props) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  useEffect(() => {
    getNoteById(route.params.id)
      .then(note => {
        if (!note) {
          navigation.navigate('Notes');
          return;
        }
        setTitle(note.title);
        setText(note.text);
        setCreatedAt(note.createdAt);
        setUpdatedAt(note.updatedAt);
      })
      .catch(error => {
        console.error('Failed to load note', error);
      });
  }, [navigation, route.params.id]);

  const handleSave = async () => {
    try {
      await updateNote(route.params.id, {
        title: title.trim() || 'Untitled',
        text: text.trim(),
      });
      navigation.navigate('Notes');
    } catch (error) {
      console.error('Failed to save note', error);
    }
  };

  const formatDate = (iso: string) =>
    iso ? new Date(iso).toLocaleString() : '—';

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Note text"
        placeholderTextColor="#9CA3AF"
        value={text}
        onChangeText={setText}
        multiline
        textAlignVertical="top"
      />

      <View style={styles.metaBlock}>
        <Text style={styles.metaLabel}>Created</Text>
        <Text style={styles.metaValue}>{formatDate(createdAt)}</Text>
        <Text style={[styles.metaLabel, styles.metaLabelSpaced]}>Updated</Text>
        <Text style={styles.metaValue}>{formatDate(updatedAt)}</Text>
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  titleInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  metaBlock: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  metaLabelSpaced: {
    marginTop: 10,
  },
  metaValue: {
    fontSize: 14,
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
