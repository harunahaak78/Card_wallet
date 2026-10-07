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

import {
  getPin,
  authenticateBiometric,
  canUseBiometrics,
} from '../utils/security';

type LockScreenProps = {
  onUnlock: () => void;
};

export default function LockScreen({
  onUnlock,
}: LockScreenProps) {
  const [pin, setPin] = useState('');
  const [checking, setChecking] = useState(false);

  const unlockWithBiometric = async () => {
    try {
      console.log('Biometric button pressed');

      const available = await canUseBiometrics();

      console.log(
        'Biometrics available:',
        available
      );

      if (!available) {
        Alert.alert(
          'Face ID unavailable',
          'Face ID cannot be used. Please use your PIN.'
        );
        return;
      }

      console.log('Starting Face ID...');

      const success =
        await authenticateBiometric();

      console.log(
        'Biometric result:',
        success
      );

      if (success) {
        onUnlock();
      } else {
        Alert.alert(
          'Face ID Failed',
          'Face ID authentication was not successful. Please try again or use your PIN.'
        );
      }
    } catch (error) {
      console.error(
        'Biometric authentication error:',
        error
      );

      Alert.alert(
        'Face ID Error',
        'Face ID could not be started. Please use your PIN.'
      );
    }
  };

  const unlock = async () => {
    if (pin.length !== 4) {
      Alert.alert(
        'Invalid PIN',
        'Enter your 4-digit PIN.'
      );
      return;
    }

    try {
      setChecking(true);

      const savedPin = await getPin();

      if (savedPin === pin) {
        setPin('');
        onUnlock();
      } else {
        setPin('');

        Alert.alert(
          'Incorrect PIN',
          'The PIN you entered is incorrect.'
        );
      }
    } catch (error) {
      console.error(
        'Unlock error:',
        error
      );

      Alert.alert(
        'Error',
        'Unable to verify your PIN.'
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            🔐
          </Text>
        </View>

        <Text style={styles.title}>
          Card Wallet Locked
        </Text>

        <Text style={styles.description}>
          Enter your PIN to access your digital cards.
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
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          autoFocus
        />

        <TouchableOpacity
          style={styles.biometricButton}
          onPress={unlockWithBiometric}
          activeOpacity={0.8}
        >
          <Text style={styles.biometricIcon}>
            👤
          </Text>

          <Text style={styles.biometricText}>
            Use Face ID / Touch ID
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            checking && styles.buttonDisabled,
          ]}
          onPress={unlock}
          disabled={checking}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {checking
              ? 'Checking...'
              : 'Unlock'}
          </Text>
        </TouchableOpacity>

        <View style={styles.securityNotice}>
          <Text style={styles.lockIcon}>
            🛡️
          </Text>

          <Text style={styles.securityText}>
            Your cards remain stored privately on this
            device.
          </Text>
        </View>

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
    paddingHorizontal: 24,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },

  icon: {
    fontSize: 38,
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },

  description: {
    marginTop: 10,
    marginBottom: 32,
    color: '#6B7280',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },

  input: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    textAlign: 'center',
    fontSize: 26,
    letterSpacing: 12,
    color: '#111827',
  },

  biometricButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },

  biometricIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  biometricText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },

  button: {
    height: 56,
    borderRadius: 15,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    padding: 15,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
  },

  lockIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  securityText: {
    flex: 1,
    color: '#1E40AF',
    fontSize: 13,
    lineHeight: 19,
  },
});