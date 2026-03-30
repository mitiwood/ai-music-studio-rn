import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
  PanResponder,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { usePlayerStore } from '../../stores/usePlayerStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ALBUM_ART_SIZE = SCREEN_WIDTH * 0.7;

interface FullPlayerProps {
  onMinimize: () => void;
}

const FullPlayer: React.FC<FullPlayerProps> = ({ onMinimize }) => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    shuffleEnabled,
    repeatMode,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    isLiked,
    toggleLike,
  } = usePlayerStore();

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [showLyrics, setShowLyrics] = useState(false);

  // 슬라이드 업 애니메이션
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, []);

  // 앨범아트 회전 애니메이션
  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (isPlaying) {
      animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();
    } else {
      rotateAnim.stopAnimation();
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [isPlaying]);

  // 아래로 스와이프 제스처
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dy > 20 && Math.abs(gestureState.dx) < 40,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          handleMinimize();
        }
      },
    })
  ).current;

  const handleMinimize = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onMinimize();
    });
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const repeatIcon = repeatMode === 'one' ? '🔂' : repeatMode === 'all' ? '🔁' : '➡️';

  if (!currentTrack) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
      {...panResponder.panHandlers}
    >
      {/* 배경 블러 */}
      <View style={styles.backgroundBlur}>
        <Image
          source={{
            uri:
              currentTrack.thumbnailUrl ||
              'https://via.placeholder.com/400',
          }}
          style={styles.backgroundImage}
          blurRadius={60}
        />
        <View style={styles.backgroundOverlay} />
      </View>

      {/* 상단 바 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleMinimize} style={styles.minimizeButton}>
          <Text style={styles.minimizeIcon}>▼</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>지금 재생 중</Text>
        <TouchableOpacity
          style={styles.queueButton}
          onPress={() => setShowLyrics(!showLyrics)}
        >
          <Text style={styles.queueIcon}>
            {showLyrics ? '🎵' : '📝'}
          </Text>
        </TouchableOpacity>
      </View>

      {!showLyrics ? (
        <>
          {/* 앨범아트 */}
          <View style={styles.albumArtContainer}>
            <Animated.View
              style={[
                styles.albumArtWrapper,
                {
                  transform: [{ rotate: rotateInterpolate }],
                },
              ]}
            >
              <Image
                source={{
                  uri:
                    currentTrack.thumbnailUrl ||
                    'https://via.placeholder.com/300',
                }}
                style={styles.albumArt}
              />
            </Animated.View>
          </View>

          {/* 트랙 정보 */}
          <View style={styles.trackInfoSection}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {currentTrack.artist || '알 수 없는 아티스트'}
            </Text>
          </View>

          {/* 진행률 바 */}
          <View style={styles.progressSection}>
            <Slider
              style={styles.progressSlider}
              minimumValue={0}
              maximumValue={duration || 1}
              value={progress}
              onSlidingComplete={seekTo}
              minimumTrackTintColor="#8B5CF6"
              maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
              thumbTintColor="#FFFFFF"
            />
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(progress)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* 메인 컨트롤 */}
          <View style={styles.mainControls}>
            <TouchableOpacity
              style={styles.sideControl}
              onPress={toggleShuffle}
            >
              <Text
                style={[
                  styles.sideControlIcon,
                  shuffleEnabled && styles.activeControl,
                ]}
              >
                🔀
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlBtn}
              onPress={playPrevious}
            >
              <Text style={styles.controlBtnIcon}>⏮</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playButton}
              onPress={togglePlay}
            >
              <Text style={styles.playButtonIcon}>
                {isPlaying ? '⏸' : '▶️'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlBtn}
              onPress={playNext}
            >
              <Text style={styles.controlBtnIcon}>⏭</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sideControl}
              onPress={toggleRepeat}
            >
              <Text
                style={[
                  styles.sideControlIcon,
                  repeatMode !== 'off' && styles.activeControl,
                ]}
              >
                {repeatIcon}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 하단 액션 버튼 */}
          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
              <Text style={styles.actionIcon}>
                {isLiked ? '❤️' : '🤍'}
              </Text>
              <Text style={styles.actionLabel}>좋아요</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionLabel}>공유</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>⬇️</Text>
              <Text style={styles.actionLabel}>다운로드</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionLabel}>대기열</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        /* 가사 패널 */
        <ScrollView
          style={styles.lyricsScroll}
          contentContainerStyle={styles.lyricsContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.lyricsTitle}>가사</Text>
          {currentTrack.lyrics ? (
            <Text style={styles.lyricsText}>{currentTrack.lyrics}</Text>
          ) : (
            <View style={styles.lyricsEmpty}>
              <Text style={styles.lyricsEmptyIcon}>📝</Text>
              <Text style={styles.lyricsEmptyText}>
                가사가 없습니다
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
  },
  backgroundBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: 56,
    paddingBottom: Spacing.md,
  },
  minimizeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minimizeIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  topTitle: {
    ...Typography.body2,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  queueButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queueIcon: {
    fontSize: 20,
  },
  albumArtContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  albumArtWrapper: {
    width: ALBUM_ART_SIZE,
    height: ALBUM_ART_SIZE,
    borderRadius: ALBUM_ART_SIZE / 2,
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
  albumArt: {
    width: '100%',
    height: '100%',
    borderRadius: ALBUM_ART_SIZE / 2,
  },
  trackInfoSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  trackTitle: {
    ...Typography.h2,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  trackArtist: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: Spacing.xs,
  },
  progressSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  progressSlider: {
    width: '100%',
    height: 40,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  timeText: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  sideControl: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideControlIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  activeControl: {
    opacity: 1,
  },
  controlBtn: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtnIcon: {
    fontSize: 28,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  playButtonIcon: {
    fontSize: 32,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    fontSize: 22,
  },
  actionLabel: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
  },
  lyricsScroll: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  lyricsContent: {
    paddingBottom: 100,
  },
  lyricsTitle: {
    ...Typography.h3,
    color: '#FFFFFF',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  lyricsText: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 28,
    textAlign: 'center',
  },
  lyricsEmpty: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  lyricsEmptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  lyricsEmptyText: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.4)',
  },
});

export default FullPlayer;
