import {useMemo} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  exportNotesToJson,
  importNotesFromJson,
} from '../database/notesTransfer';
import {ThemeColors, useAppTheme} from '../theme/ThemeContext';

export function AppDrawerContent(props: DrawerContentComponentProps) {
  const {navigation} = props;
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const closeThenRun = (action: () => void | Promise<void>) => {
    navigation.closeDrawer();
    void Promise.resolve()
      .then(action)
      .catch(error => {
        console.error('Drawer action failed', error);
      });
  };

  const handleNotes = () => {
    closeThenRun(() => {
      navigation.navigate('Root', {screen: 'Notes'});
    });
  };

  const handleNewNote = () => {
    closeThenRun(() => {
      navigation.navigate('Root', {screen: 'NoteEditor'});
    });
  };

  const handleSettings = () => {
    closeThenRun(() => {
      navigation.navigate('Root', {screen: 'Settings'});
    });
  };

  const handleExport = () => {
    closeThenRun(async () => {
      try {
        const saved = await exportNotesToJson();
        if (saved) {
          Alert.alert('Export', 'Notes exported to JSON.');
        }
      } catch (error) {
        console.error('Failed to export notes', error);
        Alert.alert('Export failed', 'Could not export notes.');
      }
    });
  };

  const handleImport = () => {
    closeThenRun(async () => {
      try {
        const imported = await importNotesFromJson();
        if (imported) {
          Alert.alert('Import', `Imported ${imported.length} notes.`);
        }
      } catch (error) {
        console.error('Failed to import notes', error);
        Alert.alert('Import failed', 'Could not import notes from JSON.');
      }
    });
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Notepad</Text>
      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={handleNotes}>
          <Text style={styles.buttonText}>Notes</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleNewNote}>
          <Text style={styles.buttonText}>New note</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleSettings}>
          <Text style={styles.buttonText}>Settings</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleExport}>
          <Text style={styles.buttonText}>Export</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleImport}>
          <Text style={styles.buttonText}>Import</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      flex: 1,
      paddingTop: 12,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    actions: {
      gap: 10,
      paddingHorizontal: 16,
    },
    button: {
      backgroundColor: colors.button,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
    },
    buttonText: {
      color: colors.onButton,
      fontSize: 15,
      fontWeight: '600',
    },
  });
