import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { usePlayerStore } from '../../stores';

interface MiniPlayerProps {
  onPress: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress }) => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    togglePlay,
    playNext,
  } = usePlayerStore();

  const marqueeAnim = useRef(new Animated.Value(0)).current;

  // 마퀴 애니메이션 (긴 제목일 때)
  useEffect(() => {
    if (currentTrack && currentTrack.title.length > 20) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.delay(2000),
          Animated.timing(marqueeAnim, {
            toValue: -100,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
          Animated.timing(marqueeAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      marqueeAnim.setValue(0);
    }
  }, [currentTrack?.title]);

  if (!currentTrack) return null;

  const progressPercent =
    duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* 상단 진행률 바 */}
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${progressPercent}%` }]}
        />
      </View>

      <View style={styles.content}>
        {/* 썸네일 */}
        <Image
          source={{
            uri:
              currentTrack.thumbnailUrl ||
              'https://via.placeholder.com/48',
          }}
          style={styles.thumbnail}
        />

        {/* 트랙 정보 */}
        <View style={styles.trackInfo}>
          <Animated.Text
            style={[
              styles.trackTitle,
              { transform: [{ translateX: marqueeAnim }] },
            ]}
            numberOfLines={1}
          >
            {currentTrack.title}
          </Animated.Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {currentTrack.artist || '알 수 없는 아티스트'}
          </Text>
        </View>

        {/* 컨트롤 버튼 */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e) => {
              e.stopPropagation();
              playNext();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="play-skip-forward" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  progressBar: {
    height: 2,
    backgroundColor: Colors.border,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.border,
  },
  trackInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
    overflow: 'hidden',
  },
  trackTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  trackArtist: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  controlButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 22,
  },
});

export default MiniPlayer;
