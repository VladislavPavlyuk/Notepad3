import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NotesScreen from '../screens/NotesScreen';

export type RootStackParamList = {
  Notes: undefined;
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
    </Stack.Navigator>
  );
}
