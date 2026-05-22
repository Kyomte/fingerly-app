import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { RootStackParamList, TabParamList } from './src/types/navigation';
import WorkoutScreen from './src/screens/WorkoutScreen';
import PresetsScreen from './src/screens/PresetsScreen';
import TimerScreen from './src/screens/TimerScreen';
import { ClimberIcon, BoulderIcon } from './src/components/icons';
import { Colors } from './src/theme';
import { RoutinesProvider } from './src/context/RoutinesContext';

const Stack = createNativeStackNavigator<RootStackParamList & { Tabs: undefined }>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({
  Icon,
  focused,
}: {
  Icon: React.FC<{ size?: number; color?: string }>;
  focused: boolean;
}) {
  return (
    <View style={{ paddingTop: 2 }}>
      <Icon size={24} color={focused ? Colors.gold : Colors.ash} />
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.black,
          borderTopColor: Colors.charcoal,
          borderTopWidth: 1,
          paddingBottom: 8,
          height: 68,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.ash,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 1.5,
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="WorkoutTab"
        component={WorkoutScreen}
        options={{
          tabBarLabel: 'WORKOUT',
          tabBarIcon: ({ focused }) => <TabIcon Icon={ClimberIcon} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="PresetsTab"
        component={PresetsScreen}
        options={{
          tabBarLabel: 'PRESETS',
          tabBarIcon: ({ focused }) => <TabIcon Icon={BoulderIcon} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RoutinesProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen
              name="Timer"
              component={TimerScreen}
              options={{ presentation: 'fullScreenModal' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </RoutinesProvider>
    </GestureHandlerRootView>
  );
}
