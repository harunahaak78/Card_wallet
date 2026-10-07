import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const PIN_KEY = 'card_wallet_pin';
const BIOMETRIC_KEY = 'card_wallet_biometric';

export async function savePin(pin: string) {
  await SecureStore.setItemAsync(PIN_KEY, pin);
}

export async function getPin() {
  return await SecureStore.getItemAsync(PIN_KEY);
}

export async function removePin() {
  await SecureStore.deleteItemAsync(PIN_KEY);
}

export async function setBiometricEnabled(
  enabled: boolean
) {
  await SecureStore.setItemAsync(
    BIOMETRIC_KEY,
    enabled ? 'true' : 'false'
  );
}

export async function isBiometricEnabled() {
  const value = await SecureStore.getItemAsync(
    BIOMETRIC_KEY
  );

  return value === 'true';
}

export async function canUseBiometrics() {
  const hasHardware =
    await LocalAuthentication.hasHardwareAsync();

  const enrolled =
    await LocalAuthentication.isEnrolledAsync();

  return hasHardware && enrolled;
}

export async function authenticateBiometric() {
  const result =
    await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Card Wallet',
      cancelLabel: 'Use PIN',
      fallbackLabel: 'Use PIN',
      disableDeviceFallback: true,
    });

  return result.success;
}