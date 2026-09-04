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
import SettingsScreen from '../screens/SettingsScreen';
import {useAppTheme} from '../theme/ThemeContext';

export type RootStackParamList = {
  Notes: undefined;
  NoteEditor: undefined;
  NoteDetails: {id: number};
  Settings: undefined;
};

export type RootDrawerParamList = {
  Root: NavigatorScreenParams<RootStackParamList>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

function RootStack() {
  const {colors} = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.surface},
        headerTintColor: colors.text,
        headerTitleStyle: {color: colors.text},
        headerShadowVisible: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
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
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Settings'}}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const {colors} = useAppTheme();

  return (
    <Drawer.Navigator
      drawerContent={props => <AppDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: true,
        swipeEdgeWidth: 56,
        drawerStyle: {backgroundColor: colors.background},
        sceneStyle: {backgroundColor: colors.background},
      }}>
      <Drawer.Screen name="Root" component={RootStack} />
    </Drawer.Navigator>
  );
}
