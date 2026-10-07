import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Card3DProps = {
  cardType: string;
  frontImage: string;
  backImage: string;
  onPress?: () => void;
};

const { width } = Dimensions.get('window');

const CARD_WIDTH = width - 48;
const CARD_HEIGHT = CARD_WIDTH / 1.586;

export default function Card3D({
  cardType,
  frontImage,
  backImage,
  onPress,
}: Card3DProps) {
  const flipAnimation = useRef(
    new Animated.Value(0)
  ).current;

  const floatAnimation = useRef(
    new Animated.Value(0)
  ).current;

  const [showBack, setShowBack] = useState(false);

  // Gentle 3D floating movement
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnimation, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),

        Animated.timing(floatAnimation, {
          toValue: -1,
          duration: 4400,
          useNativeDriver: true,
        }),

        Animated.timing(floatAnimation, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [floatAnimation]);

  const flipCard = () => {
    const nextValue = showBack ? 0 : 1;

    Animated.spring(flipAnimation, {
      toValue: nextValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    setShowBack(!showBack);
  };

  // Front rotation
  const frontRotate = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });

  // Back rotation
  const backRotate = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['180deg', '270deg', '360deg'],
  });

  // Gentle movement
  const rotateX = floatAnimation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['2deg', '0deg', '-2deg'],
  });

  const rotateY = floatAnimation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
  });

  const translateY = floatAnimation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [4, 0, -4],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={flipCard}
        style={styles.cardTouchable}
      >
        {/* FRONT */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { perspective: 1000 },
                { rotateX },
                { rotateY: Animated.add(
                    rotateY,
                    flipAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                    })
                  ) },
                { translateY },
              ],
            },
          ]}
        >
          <Image
            source={{ uri: frontImage }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.label}>
            <Text style={styles.labelText}>
              {cardType}
            </Text>
          </View>

          <View style={styles.sideShadow} />
        </Animated.View>

        {/* BACK */}
        <Animated.View
          style={[
            styles.card,
            styles.backCard,
            {
              transform: [
                { perspective: 1000 },
                { rotateX },
                {
                  rotateY: Animated.add(
                    rotateY,
                    flipAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['180deg', '360deg'],
                    })
                  ),
                },
                { translateY },
              ],
            },
          ]}
        >
          <Image
            source={{ uri: backImage }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.label}>
            <Text style={styles.labelText}>
              {cardType} • BACK
            </Text>
          </View>

          <View style={styles.sideShadow} />
        </Animated.View>
      </TouchableOpacity>

      {/* CONTROLS */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={flipCard}
          activeOpacity={0.8}
        >
          <Text style={styles.flipIcon}>↻</Text>

          <Text style={styles.flipText}>
            Flip Card
          </Text>
        </TouchableOpacity>

        {onPress && (
          <TouchableOpacity
            style={styles.viewButton}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <Text style={styles.viewText}>
              View Card
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.hint}>
        Tap the card to flip
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },

  cardTouchable: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },

  card: {
    position: 'absolute',

    width: CARD_WIDTH,
    height: CARD_HEIGHT,

    borderRadius: 18,

    overflow: 'hidden',

    backgroundColor: '#E5E7EB',

    backfaceVisibility: 'hidden',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 12,
    },

    shadowOpacity: 0.22,

    shadowRadius: 18,

    elevation: 10,
  },

  backCard: {
    backgroundColor: '#F3F4F6',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  label: {
    position: 'absolute',

    left: 14,
    bottom: 14,

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 10,

    backgroundColor: 'rgba(0,0,0,0.68)',
  },

  labelText: {
    color: '#FFFFFF',

    fontSize: 12,

    fontWeight: '700',
  },

  sideShadow: {
    position: 'absolute',

    top: 0,
    bottom: 0,

    right: 0,

    width: 30,

    backgroundColor: 'rgba(0,0,0,0.08)',
  },

  controls: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 20,

    gap: 10,
  },

  flipButton: {
    height: 46,

    paddingHorizontal: 18,

    borderRadius: 13,

    backgroundColor: '#111827',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',
  },

  flipIcon: {
    color: '#FFFFFF',

    fontSize: 20,

    marginRight: 7,
  },

  flipText: {
    color: '#FFFFFF',

    fontSize: 14,

    fontWeight: '700',
  },

  viewButton: {
    height: 46,

    paddingHorizontal: 18,

    borderRadius: 13,

    backgroundColor: '#E5E7EB',

    alignItems: 'center',

    justifyContent: 'center',
  },

  viewText: {
    color: '#111827',

    fontSize: 14,

    fontWeight: '700',
  },

  hint: {
    marginTop: 10,

    color: '#6B7280',

    fontSize: 12,
  },
});