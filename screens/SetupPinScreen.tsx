import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { savePin } from '../utils/security';

export default function SetupPinScreen() {
  const [pin, setPin] = useState('');

  const createPin = async () => {
    if (pin.length !== 4) {
      Alert.alert(
        'Invalid PIN',
        'Enter exactly 4 digits.'
      );
      return;
    }

    try {
      await savePin(pin);

      Alert.alert(
        'Success',
        'PIN saved securely on this device.'
      );
    } catch (error) {
      console.error('SecureStore error:', error);

      Alert.alert(
        'Error',
        'Could not save PIN.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🔐</Text>

        <Text style={styles.title}>
          Create PIN
        </Text>

        <Text style={styles.description}>
          Create a 4-digit PIN to protect your cards.
        </Text>

        <TextInput
          value={pin}
          onChangeText={(value) =>
            setPin(
              value
                .replace(/[^0-9]/g, '')
                .slice(0, 4)
            )
          }
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
          placeholder="••••"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={createPin}
        >
          <Text style={styles.buttonText}>
            Save PIN
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111827',
  },

  description: {
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 15,
  },

  input: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 15,
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 10,
  },

  button: {
    height: 56,
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});