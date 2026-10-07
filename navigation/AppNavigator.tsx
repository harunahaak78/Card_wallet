import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AddCardScreen from '../screens/AddCardScreen';
import ScanCardScreen from '../screens/ScanCardScreen';
import CardPreviewScreen from '../screens/CardPreviewScreen';
import CardViewerScreen from '../screens/CardViewerScreen';

export type RootStackParamList = {
  Home: undefined;
  AddCard: undefined;
  ScanCard: {
    cardType: string;
  };
  CardPreview: {
    cardType: string;
    frontImage: string;
    backImage: string;
  };
  CardViewer: {
    id: string;
    cardType: string;
    frontImage: string;
    backImage: string;
  };

};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />

      <Stack.Screen
        name="AddCard"
        component={AddCardScreen}
      />

      <Stack.Screen
        name="ScanCard"
        component={ScanCardScreen}
      />

      <Stack.Screen
       name="CardPreview"
       component={CardPreviewScreen}
      />
      <Stack.Screen
        name="CardViewer"
        component={CardViewerScreen}
      />
    </Stack.Navigator>
  );
}