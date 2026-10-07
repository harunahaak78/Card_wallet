import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

import {
  CameraView,
  useCameraPermissions,
  CameraType,
} from 'expo-camera';

import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function ScanCardScreen() {
    const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();
  const route = useRoute();

  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();

  const [facing, setFacing] = useState<CameraType>('back');

  const [side, setSide] = useState<'front' | 'back'>('front');

  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  const cardType =
    (route.params as { cardType?: string } | undefined)?.cardType ??
    'Card';

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>
          Checking camera permission...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionIcon}>📷</Text>

          <Text style={styles.permissionTitle}>
            Camera Access Required
          </Text>

          <Text style={styles.permissionText}>
            We need access to your camera so you can scan the
            front and back of your card.
          </Text>

          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>
              Allow Camera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) {
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      if (!photo?.uri) {
        Alert.alert(
          'Camera Error',
          'Could not capture the photo.'
        );
        return;
      }

      if (side === 'front') {
        setFrontImage(photo.uri);
        setSide('back');

        Alert.alert(
          'Front Captured',
          'Now turn your card over and capture the back.'
        );
    } else {
        setBackImage(photo.uri);
        navigation.navigate('CardPreview', {
            cardType,
            frontImage: frontImage!,
            backImage: photo.uri,
          });
      }
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Camera Error',
        'Something went wrong while taking the photo.'
      );
    }
  };

  const retakeFront = () => {
    setFrontImage(null);
    setBackImage(null);
    setSide('front');
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
      />

      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>
                Scan {cardType}
              </Text>

              <Text style={styles.headerSubtitle}>
                {side === 'front'
                  ? 'Front side'
                  : 'Back side'}
              </Text>
            </View>

            <View style={styles.headerSpacer} />
          </View>

          {/* Instructions */}
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>
              {side === 'front'
                ? 'Position the front of your card'
                : 'Position the back of your card'}
            </Text>

            <Text style={styles.instructionText}>
              Keep the entire card inside the frame
            </Text>
          </View>

          {/* Card guide */}
          <View style={styles.cardGuide}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.step,
                  styles.stepActive,
                ]}
              >
                <Text style={styles.stepText}>
                  {frontImage ? '✓' : '1'}
                </Text>
              </View>

              <View
                style={[
                  styles.stepLine,
                  frontImage && styles.stepLineActive,
                ]}
              />

              <View
                style={[
                  styles.step,
                  side === 'back' && styles.stepActive,
                ]}
              >
                <Text style={styles.stepText}>2</Text>
              </View>
            </View>

            <Text style={styles.stepLabel}>
              {side === 'front'
                ? 'Capture front'
                : 'Capture back'}
            </Text>

            <View style={styles.cameraControls}>
              <View style={styles.sideButtonPlaceholder} />

              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                activeOpacity={0.8}
              >
                <View style={styles.captureInner} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.flipButton}
                onPress={() => {
                  setFacing((current) =>
                    current === 'back'
                      ? 'front'
                      : 'back'
                  );
                }}
              >
                <Text style={styles.flipIcon}>↻</Text>
              </TouchableOpacity>
            </View>

            {frontImage && side === 'back' && (
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={retakeFront}
              >
                <Text style={styles.retakeText}>
                  Retake front
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  overlay: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  loadingText: {
    color: '#fff',
    fontSize: 16,
  },

  permissionContainer: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  permissionContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
  },

  permissionIcon: {
    fontSize: 56,
    marginBottom: 20,
  },

  permissionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },

  permissionText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },

  permissionButton: {
    width: '100%',
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
  },

  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  cancelButton: {
    marginTop: 15,
    padding: 10,
  },

  cancelText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -3,
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#D1D5DB',
    fontSize: 13,
    marginTop: 3,
  },

  headerSpacer: {
    width: 44,
  },

  instructionContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },

  instructionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  instructionText: {
    color: '#D1D5DB',
    fontSize: 13,
    marginTop: 5,
    textAlign: 'center',
  },

  cardGuide: {
    width: '86%',
    aspectRatio: 1.586,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 18,
    alignSelf: 'center',
    position: 'relative',
  },

  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#fff',
  },

  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 18,
  },

  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 18,
  },

  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 18,
  },

  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 18,
  },

  bottomControls: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepActive: {
    backgroundColor: '#fff',
  },

  stepText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '800',
  },

  stepLine: {
    width: 50,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },

  stepLineActive: {
    backgroundColor: '#fff',
  },

  stepLabel: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 15,
  },

  cameraControls: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sideButtonPlaceholder: {
    width: 54,
    height: 54,
  },

  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#fff',
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#111827',
  },

  flipButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  flipIcon: {
    color: '#fff',
    fontSize: 28,
  },

  retakeButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  retakeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});