import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
    useNavigation,
  } from '@react-navigation/native';
  
  import {
    NativeStackNavigationProp,
  } from '@react-navigation/native-stack';
  
  import {
    RootStackParamList,
  } from '../navigation/AppNavigator';

const cardTypes = [
  {
    id: 'ghana-card',
    name: 'Ghana Card',
    description: 'National identification card',
    icon: '🪪',
  },
  {
    id: 'drivers-license',
    name: "Driver's License",
    description: 'Driver identification card',
    icon: '🚗',
  },
  {
    id: 'health-insurance',
    name: 'Health Insurance',
    description: 'Health insurance identification',
    icon: '🏥',
  },
  {
    id: 'other',
    name: 'Other ID',
    description: 'Another identification card',
    icon: '💳',
  },
];

export default function AddCardScreen() {
    const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
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
            <Text style={styles.title}>Add Card</Text>
            <Text style={styles.subtitle}>
              Choose your card type
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>📷</Text>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              You'll scan both sides
            </Text>

            <Text style={styles.infoText}>
              Make sure your card is clean, flat and
              completely visible when taking the photos.
            </Text>
          </View>
        </View>

        {/* Card Types */}
        <Text style={styles.sectionTitle}>
          Select card type
        </Text>

        {cardTypes.map((card) => {
          const selected = selectedCard === card.id;

          return (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.cardOption,
                selected && styles.cardOptionSelected,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedCard(card.id)}
            >
              <View
                style={[
                  styles.iconContainer,
                  selected && styles.iconContainerSelected,
                ]}
              >
                <Text style={styles.icon}>{card.icon}</Text>
              </View>

              <View style={styles.cardText}>
                <Text style={styles.cardName}>
                  {card.name}
                </Text>

                <Text style={styles.cardDescription}>
                  {card.description}
                </Text>
              </View>

              <View
                style={[
                  styles.radio,
                  selected && styles.radioSelected,
                ]}
              >
                {selected && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Continue */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedCard && styles.continueDisabled,
          ]}
          disabled={!selectedCard}
          activeOpacity={0.8}
          onPress={() => {
            if (!selectedCard) return;
          
            navigation.navigate('ScanCard', {
              cardType:
                cardTypes.find(
                  (card) => card.id === selectedCard
                )?.name ?? 'Card',
            });
          }}
        >
          <Text style={styles.continueText}>
            Continue
          </Text>

          <Text style={styles.continueArrow}>
            →
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
    marginBottom: 28,
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

  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 28,
  },

  infoIcon: {
    fontSize: 28,
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
  },

  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#1D4ED8',
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },

  cardOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },

  cardOptionSelected: {
    borderColor: '#111827',
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  iconContainerSelected: {
    backgroundColor: '#E5E7EB',
  },

  icon: {
    fontSize: 25,
  },

  cardText: {
    flex: 1,
  },

  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  cardDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioSelected: {
    borderColor: '#111827',
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#111827',
  },

  continueButton: {
    marginTop: 20,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#111827',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueDisabled: {
    backgroundColor: '#D1D5DB',
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  continueArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 10,
  },
});

