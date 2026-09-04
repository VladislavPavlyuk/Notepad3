import {useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ThemedTextInput} from '../components/ThemedTextInput';
import {createNote} from '../database/notesRepository';
import {RootStackParamList} from '../navigation/AppNavigator';
import {ThemeColors, useAppTheme} from '../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteEditor'>;

export default function NoteEditorScreen({navigation}: Props) {
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const trimmedText = text.trim();

    try {
      await createNote({
        title: trimmedTitle || 'Untitled',
        text: trimmedText,
      });
      navigation.navigate('Notes');
    } catch (error) {
      console.error('Failed to save note', error);
    }
  };

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
      marginBottom: 16,
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
