import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

type PreviewParams = {
  cardType: string;
  frontImage: string;
  backImage: string;
};

export default function CardPreviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    cardType,
    frontImage,
    backImage,
  } = route.params as PreviewParams;

  const [saving, setSaving] = useState(false);

  const saveCard = async () => {
    try {
      setSaving(true);

      const cardId = `${Date.now()}`;

      const cardDirectory =
        `${FileSystem.documentDirectory}cards/${cardId}/`;

      await FileSystem.makeDirectoryAsync(
        cardDirectory,
        {
          intermediates: true,
        }
      );

      const frontPath =
        `${cardDirectory}front.jpg`;

      const backPath =
        `${cardDirectory}back.jpg`;

      await FileSystem.copyAsync({
        from: frontImage,
        to: frontPath,
      });

      await FileSystem.copyAsync({
        from: backImage,
        to: backPath,
      });

      const existingCards =
        await AsyncStorage.getItem('digital_cards');

      const cards = existingCards
        ? JSON.parse(existingCards)
        : [];

      const newCard = {
        id: cardId,
        cardType,
        frontImage: frontPath,
        backImage: backPath,
        createdAt: new Date().toISOString(),
      };

      cards.push(newCard);

      await AsyncStorage.setItem(
        'digital_cards',
        JSON.stringify(cards)
      );

      Alert.alert(
        'Card Saved',
        `${cardType} has been saved to your digital wallet.`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Home' as never);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Save card error:', error);

      Alert.alert(
        'Save Failed',
        'We could not save your card. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>
              Card Preview
            </Text>

            <Text style={styles.subtitle}>
              {cardType}
            </Text>
          </View>
        </View>

        {/* Notice */}

        <View style={styles.notice}>
          <Text style={styles.noticeIcon}>✓</Text>

          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>
              Both sides captured
            </Text>

            <Text style={styles.noticeText}>
              Check that your card is clearly visible
              before saving it.
            </Text>
          </View>
        </View>

        {/* Front */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Front
            </Text>

            <Text style={styles.check}>
              ✓ Captured
            </Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={{ uri: frontImage }}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Back */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Back
            </Text>

            <Text style={styles.check}>
              ✓ Captured
            </Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={{ uri: backImage }}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Privacy */}

        <View style={styles.securityBox}>
          <Text style={styles.lock}>
            🔒
          </Text>

          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>
              Stored on your device
            </Text>

            <Text style={styles.securityText}>
              Your card images will stay inside this
              app's local storage in this version.
            </Text>
          </View>
        </View>

        {/* Buttons */}

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
          ]}
          disabled={saving}
          onPress={saveCard}
          activeOpacity={0.8}
        >
          <Text style={styles.saveIcon}>✓</Text>

          <Text style={styles.saveText}>
            {saving ? 'Saving...' : 'Save Card'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => navigation.goBack()}
          disabled={saving}
        >
          <Text style={styles.retakeText}>
            Retake Photos
          </Text>
        </TouchableOpacity>
      </ScrollView>
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

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  backText: {
    fontSize: 34,
    color: '#111827',
    marginTop: -4,
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 3,
  },

  notice: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },

  noticeIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: '800',
    marginRight: 12,
  },

  noticeContent: {
    flex: 1,
  },

  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },

  noticeText: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 18,
    marginTop: 3,
  },

  section: {
    marginBottom: 22,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  check: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },

  imageContainer: {
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 10,
    overflow: 'hidden',
  },

  cardImage: {
    width: '100%',
    aspectRatio: 1.586,
    borderRadius: 12,
  },

  securityBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },

  lock: {
    fontSize: 20,
    marginRight: 12,
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  securityText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
    marginTop: 3,
  },

  saveButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#111827',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginRight: 9,
    fontWeight: '800',
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  retakeButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  retakeText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
});