import {useEffect, useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NoteItem} from '../components/NoteItem';
import {initDatabase} from '../database/db';
import {subscribeNotesChanged} from '../database/notesEvents';
import {getAllNotes} from '../database/notesRepository';
import {RootStackParamList} from '../navigation/AppNavigator';
import {ThemeColors, useAppTheme} from '../theme/ThemeContext';
import {Note} from '../types/Note';

type Props = NativeStackScreenProps<RootStackParamList, 'Notes'>;

export default function NotesScreen({navigation}: Props) {
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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

    const reload = () => {
      loadNotes().catch(error => {
        console.error('Failed to load notes', error);
      });
    };

    const unsubscribeFocus = navigation.addListener('focus', reload);
    const unsubscribeNotes = subscribeNotesChanged(reload);

    return () => {
      cancelled = true;
      unsubscribeFocus();
      unsubscribeNotes();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <Pressable
            android_ripple={{color: colors.ripple}}
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
        style={({pressed}) => [styles.addButton, pressed && styles.pressed]}
        android_ripple={{color: colors.ripple}}
        onPress={() => navigation.navigate('NoteEditor')}>
        <Text style={styles.addButtonText}>+ Add note</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      padding: 16,
      paddingBottom: 100,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.textMuted,
      fontSize: 15,
      marginTop: 40,
    },
    addButton: {
      position: 'absolute',
      right: 20,
      bottom: 28,
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 28,
      elevation: 4,
      shadowColor: colors.shadow,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    pressed: {
      opacity: 0.85,
    },
    addButtonText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
  });
