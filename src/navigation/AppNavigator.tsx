import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NoteDetailsScreen from '../screens/NoteDetailsScreen';
import NoteEditorScreen from '../screens/NoteEditorScreen';
import NotesScreen from '../screens/NotesScreen';

export type RootStackParamList = {
  Notes: undefined;
  NoteEditor: undefined;
  NoteDetails: {id: number};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notes"
        component={NotesScreen}
        options={{title: 'Notes'}}
      />
      <Stack.Screen
        name="NoteEditor"
        component={NoteEditorScreen}
        options={{title: 'New note'}}
      />
      <Stack.Screen
        name="NoteDetails"
        component={NoteDetailsScreen}
        options={{title: 'Edit note'}}
      />
    </Stack.Navigator>
  );
}
