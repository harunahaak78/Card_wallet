import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList } from '../navigation/AppNavigator';
import Card3D from '../components/Card3D';

type HomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'Home'>;

type DigitalCard = {
  id: string;
  cardType: string;
  frontImage: string;
  backImage: string;
  createdAt: string;
};

export default function HomeScreen() {
  const navigation =
    useNavigation<HomeScreenNavigationProp>();

  const [cards, setCards] = useState<DigitalCard[]>([]);

  const loadCards = async () => {
    try {
      const storedCards =
        await AsyncStorage.getItem('digital_cards');

      if (storedCards) {
        setCards(JSON.parse(storedCards));
      } else {
        setCards([]);
      }
    } catch (error) {
      console.error('Load cards error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              My Cards
            </Text>

            <Text style={styles.subtitle}>
              Your digital card wallet
            </Text>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
          >
            <Text style={styles.settingsIcon}>
              ⚙
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Card */}

        <TouchableOpacity
          style={styles.addCard}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('AddCard')
          }
        >
          <View style={styles.addIconContainer}>
            <Text style={styles.addIcon}>
              ＋
            </Text>
          </View>

          <View style={styles.addCardText}>
            <Text style={styles.addTitle}>
              Add a Card
            </Text>

            <Text style={styles.addSubtitle}>
              Scan the front and back of your card
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </TouchableOpacity>
        {/* 3D CARD SHOWCASE */}

        {cards.length > 0 && (
        <View style={styles.showcaseSection}>
            <View style={styles.showcaseHeader}>
            <View>
                <Text style={styles.showcaseTitle}>
                3D Card Showcase
                </Text>

                <Text style={styles.showcaseSubtitle}>
                Tap your card to flip it
                </Text>
            </View>

            <View style={styles.showcaseBadge}>
                <Text style={styles.showcaseBadgeText}>
                3D
                </Text>
            </View>
            </View>

            <Card3D
            cardType={cards[0].cardType}
            frontImage={cards[0].frontImage}
            backImage={cards[0].backImage}
            onPress={() =>
                navigation.navigate('CardViewer', {
                id: cards[0].id,
                cardType: cards[0].cardType,
                frontImage: cards[0].frontImage,
                backImage: cards[0].backImage,
                })
            }
            />
        </View>
        )}

        {/* Card Section */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            My Digital Cards
          </Text>

          <Text style={styles.cardCount}>
            {cards.length}{' '}
            {cards.length === 1 ? 'card' : 'cards'}
          </Text>
        </View>

        {/* Saved Cards */}

        {cards.length > 0 ? (
          cards.map((card) => (
            <TouchableOpacity
                key={card.id}
                style={styles.cardItem}
                activeOpacity={0.85}
                onPress={() =>
                    navigation.navigate('CardViewer', {
                      id: card.id,
                      cardType: card.cardType,
                      frontImage: card.frontImage,
                      backImage: card.backImage,
                    })
                  }
             >
              <Image
                source={{
                  uri: card.frontImage,
                }}
                style={styles.cardThumbnail}
                resizeMode="cover"
              />

              <View style={styles.cardItemInfo}>
                <Text style={styles.cardItemTitle}>
                  {card.cardType}
                </Text>

                <Text style={styles.cardItemSubtitle}>
                  Front & back saved
                </Text>

                <Text style={styles.cardItemDate}>
                  Added{' '}
                  {new Date(
                    card.createdAt
                  ).toLocaleDateString()}
                </Text>
              </View>

              <Text style={styles.cardArrow}>
                ›
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          /* Empty State */

          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>
                ▣
              </Text>
            </View>

            <Text style={styles.emptyTitle}>
              No cards yet
            </Text>

            <Text style={styles.emptyDescription}>
              Add your first card to create a secure
              digital version you can access from
              your phone.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('AddCard')
              }
            >
              <Text style={styles.primaryButtonText}>
                ＋ Add Your First Card
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Security */}

        <View style={styles.securityNotice}>
          <Text style={styles.lockIcon}>
            🔒
          </Text>

          <View style={styles.securityTextContainer}>
            <Text style={styles.securityTitle}>
              Your cards stay private
            </Text>

            <Text style={styles.securityDescription}>
              Your card images are stored securely
              on your device.
            </Text>
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  settingsIcon: {
    fontSize: 21,
  },

  addCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },

  addIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  addIcon: {
    fontSize: 30,
    color: '#111827',
    fontWeight: '300',
  },

  addCardText: {
    flex: 1,
  },

  addTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  addSubtitle: {
    fontSize: 13,
    color: '#D1D5DB',
    marginTop: 4,
    lineHeight: 18,
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
    marginLeft: 8,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  cardCount: {
    fontSize: 13,
    color: '#6B7280',
  },

  cardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  cardThumbnail: {
    width: 82,
    height: 54,
    borderRadius: 9,
    backgroundColor: '#E5E7EB',
  },

  cardItemInfo: {
    flex: 1,
    marginLeft: 14,
  },

  cardItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  cardItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
  },

  cardItemDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },

  cardArrow: {
    fontSize: 28,
    color: '#9CA3AF',
    marginLeft: 8,
  },

  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 36,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  emptyIconText: {
    fontSize: 34,
    color: '#6B7280',
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },

  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 300,
    marginBottom: 24,
  },

  primaryButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  securityNotice: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
  },

  lockIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  securityTextContainer: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },

  securityDescription: {
    fontSize: 12,
    color: '#047857',
    marginTop: 3,
    lineHeight: 17,
  },
  showcaseSection: {
    marginBottom: 30,
  },
  
  showcaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  
  showcaseTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  
  showcaseSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  
  showcaseBadge: {
    backgroundColor: '#111827',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
  },
  
  showcaseBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});