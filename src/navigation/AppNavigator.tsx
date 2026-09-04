import {
  createDrawerNavigator,
  DrawerToggleButton,
} from '@react-navigation/drawer';
import {NavigatorScreenParams} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppDrawerContent} from '../components/AppDrawerContent';
import NoteDetailsScreen from '../screens/NoteDetailsScreen';
import NoteEditorScreen from '../screens/NoteEditorScreen';
import NotesScreen from '../screens/NotesScreen';

export type RootStackParamList = {
  Notes: undefined;
  NoteEditor: undefined;
  NoteDetails: {id: number};
};

export type RootDrawerParamList = {
  Root: NavigatorScreenParams<RootStackParamList>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notes"
        component={NotesScreen}
        options={{
          title: 'Notes',
          headerLeft: ({tintColor}) => (
            <DrawerToggleButton tintColor={tintColor} />
          ),
        }}
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

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <AppDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: true,
        swipeEdgeWidth: 56,
      }}>
      <Drawer.Screen name="Root" component={RootStack} />
    </Drawer.Navigator>
  );
}
