import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

const { width } = Dimensions.get('window');

const CARD_WIDTH = width - 32;
const CARD_HEIGHT = CARD_WIDTH / 1.586;

type ViewerParams = {
    id: string;
    cardType: string;
    frontImage: string;
    backImage: string;
  };

export default function CardViewerScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    id,
    cardType,
    frontImage,
    backImage,
  } = route.params as ViewerParams;

  const [showBack, setShowBack] = useState(false);

  const flipAnimation = useRef(
    new Animated.Value(0)
  ).current;

  const flipCard = () => {
    Animated.spring(flipAnimation, {
      toValue: showBack ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    setShowBack(!showBack);
  };

  const frontRotate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const deleteCard = () => {
    Alert.alert(
      'Delete Card',
      `Are you sure you want to permanently delete this ${cardType}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Get saved cards
              const storedCards =
                await AsyncStorage.getItem('digital_cards');
  
              const cards = storedCards
                ? JSON.parse(storedCards)
                : [];
  
              // Find the card being deleted
              const cardToDelete = cards.find(
                (card: any) => card.id === id
              );
  
              // Delete the actual image files
              if (cardToDelete) {
                try {
                  if (
                    await FileSystem.getInfoAsync(
                      cardToDelete.frontImage
                    ).then((result) => result.exists)
                  ) {
                    await FileSystem.deleteAsync(
                      cardToDelete.frontImage,
                      { idempotent: true }
                    );
                  }
  
                  if (
                    await FileSystem.getInfoAsync(
                      cardToDelete.backImage
                    ).then((result) => result.exists)
                  ) {
                    await FileSystem.deleteAsync(
                      cardToDelete.backImage,
                      { idempotent: true }
                    );
                  }
                } catch (fileError) {
                  console.log(
                    'Image deletion warning:',
                    fileError
                  );
                }
              }
  
              // Remove card from storage
              const updatedCards = cards.filter(
                (card: any) => card.id !== id
              );
  
              await AsyncStorage.setItem(
                'digital_cards',
                JSON.stringify(updatedCards)
              );
  
              Alert.alert(
                'Card Deleted',
                'The card has been permanently removed.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              console.error(
                'Delete card error:',
                error
              );
  
              Alert.alert(
                'Delete Failed',
                'We could not delete the card. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.title}>
              {cardType}
            </Text>

            <Text style={styles.subtitle}>
              Digital Card
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* Card */}

        <View style={styles.cardArea}>

          <TouchableOpacity
            activeOpacity={0.95}
            onPress={flipCard}
          >
            <View
              style={[
                styles.cardContainer,
                {
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                },
              ]}
            >

              {/* Front */}

              <Animated.View
                style={[
                  styles.cardFace,
                  {
                    transform: [
                      { perspective: 1200 },
                      { rotateY: frontRotate },
                    ],
                  },
                ]}
              >
                <Image
                  source={{
                    uri: frontImage,
                  }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />

                <View style={styles.faceLabel}>
                  <Text style={styles.faceLabelText}>
                    FRONT
                  </Text>
                </View>
              </Animated.View>

              {/* Back */}

              <Animated.View
                style={[
                  styles.cardFace,
                  styles.cardBack,
                  {
                    transform: [
                      { perspective: 1200 },
                      { rotateY: backRotate },
                    ],
                  },
                ]}
              >
                <Image
                  source={{
                    uri: backImage,
                  }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />

                <View style={styles.faceLabel}>
                  <Text style={styles.faceLabelText}>
                    BACK
                  </Text>
                </View>
              </Animated.View>

            </View>
          </TouchableOpacity>

          {/* Flip hint */}

          <View style={styles.flipHint}>
            <Text style={styles.flipIcon}>
              ↻
            </Text>

            <Text style={styles.flipText}>
              Tap card to flip
            </Text>
          </View>

        </View>

        {/* Bottom */}

        <View style={styles.bottom}>

        <View style={styles.statusBox}>
            <Text style={styles.statusIcon}>
            🔒
            </Text>

            <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
                Private digital copy
            </Text>

            <Text style={styles.statusText}>
                This card is stored locally on your device.
            </Text>
            </View>
        </View>

        <TouchableOpacity
            style={styles.flipButton}
            onPress={flipCard}
            activeOpacity={0.8}
        >
            <Text style={styles.flipButtonIcon}>
            ↻
            </Text>

            <Text style={styles.flipButtonText}>
            Flip Card
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.deleteButton}
            onPress={deleteCard}
            activeOpacity={0.8}
        >
            <Text style={styles.deleteIcon}>
            🗑
            </Text>

            <Text style={styles.deleteText}>
            Delete Card
            </Text>
        </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  backText: {
    fontSize: 34,
    color: '#111827',
    marginTop: -4,
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
  },

  headerSpacer: {
    width: 44,
  },

  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardContainer: {
    position: 'relative',
  },

  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    backgroundColor: '#111827',
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },

  cardBack: {
    backfaceVisibility: 'hidden',
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },

  faceLabel: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  faceLabelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  flipHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },

  flipIcon: {
    fontSize: 20,
    color: '#6B7280',
    marginRight: 7,
  },

  flipText: {
    fontSize: 13,
    color: '#6B7280',
  },

  bottom: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  statusBox: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginBottom: 14,
  },

  statusIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  statusContent: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },

  statusText: {
    fontSize: 12,
    color: '#047857',
    marginTop: 3,
  },

  flipButton: {
    width: '100%',
    height: 54,
    borderRadius: 15,
    backgroundColor: '#111827',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },

  flipButtonIcon: {
    color: '#FFFFFF',
    fontSize: 21,
    marginRight: 9,
  },

  flipButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteButton: {
    width: '100%',
    height: 52,
    borderRadius: 15,
    backgroundColor: '#FEE2E2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  
  deleteIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  
  deleteText: {
    color: '#B91C1C',
    fontSize: 15,
    fontWeight: '700',
  },
});