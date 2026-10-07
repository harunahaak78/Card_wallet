import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import AppNavigator from './navigation/AppNavigator';
import LockScreen from './screens/LockScreen';

export default function App() {
  const [checkingSecurity, setCheckingSecurity] =
    useState(true);

  const [locked, setLocked] = useState(false);

  const appState = useRef<AppStateStatus>(
    AppState.currentState
  );

  const hasUnlocked = useRef(false);

  useEffect(() => {
    checkSecurity();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const checkSecurity = async () => {
    try {
      const pin = await SecureStore.getItemAsync(
        'card_wallet_pin'
      );

      if (pin) {
        setLocked(true);
      }
    } catch (error) {
      console.error(
        'Security check error:',
        error
      );
    } finally {
      setCheckingSecurity(false);
    }
  };

  const handleAppStateChange = (
    nextState: AppStateStatus
  ) => {
    const previousState = appState.current;

    if (
      previousState === 'active' &&
      (nextState === 'inactive' ||
        nextState === 'background')
    ) {
      if (hasUnlocked.current) {
        setLocked(true);
      }
    }

    appState.current = nextState;
  };

  const handleUnlock = () => {
    hasUnlocked.current = true;
    setLocked(false);
  };

  if (checkingSecurity) {
    return null;
  }

  if (locked) {
    return (
      <LockScreen
        onUnlock={handleUnlock}
      />
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}