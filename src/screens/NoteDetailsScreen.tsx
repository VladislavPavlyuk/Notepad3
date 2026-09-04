import {useEffect, useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ThemedTextInput} from '../components/ThemedTextInput';
import {getNoteById, updateNote} from '../database/notesRepository';
import {RootStackParamList} from '../navigation/AppNavigator';
import {ThemeColors, useAppTheme} from '../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteDetails'>;

export default function NoteDetailsScreen({route, navigation}: Props) {
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
      <ThemedTextInput
        style={styles.titleInput}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <ThemedTextInput
        style={styles.textInput}
        placeholder="Note text"
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

      <Pressable
        style={({pressed}) => [styles.saveButton, pressed && styles.pressed]}
        android_ripple={{color: colors.ripple}}
        onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>
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
    titleInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    textInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text,
      marginBottom: 12,
    },
    metaBlock: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
    },
    metaLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginBottom: 4,
    },
    metaLabelSpaced: {
      marginTop: 10,
    },
    metaValue: {
      fontSize: 14,
      color: colors.text,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    saveButtonText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    pressed: {
      opacity: 0.85,
    },
  });
