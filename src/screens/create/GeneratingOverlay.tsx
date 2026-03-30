import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  FlatList,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { useMusicStore, usePlayerStore } from '../../stores';

const TIPS = [
  '장르를 조합하면 더 독특한 음악이 탄생해요!',
  'BPM 120은 가장 보편적인 템포입니다.',
  '가사에 감정을 담으면 AI가 더 잘 이해해요.',
  '태그를 많이 추가할수록 원하는 느낌에 가까워져요.',
  '인스트루멘탈 모드로 BGM을 만들어보세요.',
  'Lo-Fi + 잔잔한 조합은 공부할 때 딱이에요!',
  '생성된 곡은 라이브러리에서 언제든 다시 들을 수 있어요.',
  'MV 모드로 나만의 뮤직비디오를 만들어보세요!',
];

interface GeneratedTrack {
  id: string;
  title: string;
  thumbnailUrl?: string;
  audioUrl: string;
}

const GeneratingOverlay: React.FC = () => {
  const {
    generatingProgress,
    generatingStatus,
    generatedTracks,
    cancelGenerate,
    isGenerating,
  } = useMusicStore();
  const { playTrack } = usePlayerStore();

  const [currentTip, setCurrentTip] = useState(0);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 진행률 원형 애니메이션
  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, []);

  // 페이드인
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // 팁 로테이션
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.round((generatingProgress || 0) * 100);
  const isComplete = generatedTracks && generatedTracks.length > 0;

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handlePlayTrack = (track: GeneratedTrack) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: '내가 만든 곡',
      audioUrl: track.audioUrl,
      thumbnailUrl: track.thumbnailUrl,
    });
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        {!isComplete ? (
          <>
            {/* 진행률 표시 */}
            <View style={styles.progressContainer}>
              <Animated.View
                style={[
                  styles.spinner,
                  { transform: [{ rotate: spinInterpolate }] },
                ]}
              >
                <View style={styles.spinnerTrack}>
                  <View
                    style={[
                      styles.spinnerFill,
                      {
                        width: `${progressPercent}%`,
                      },
                    ]}
                  />
                </View>
              </Animated.View>
              <Text style={styles.progressText}>{progressPercent}%</Text>
            </View>

            {/* 상태 텍스트 */}
            <Text style={styles.statusText}>
              {generatingStatus || '음악을 생성하고 있습니다...'}
            </Text>

            {/* 팁 */}
            <View style={styles.tipContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs}}>
                <Icon name="bulb" size={14} color="#8B5CF6" style={{marginRight: 4}} />
                <Text style={[styles.tipLabel, {marginBottom: 0}]}>팁</Text>
              </View>
              <Text style={styles.tipText}>{TIPS[currentTip]}</Text>
            </View>

            {/* 취소 버튼 */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelGenerate}
            >
              <Text style={styles.cancelButtonText}>생성 취소</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* 생성 완료 */}
            <Icon name="checkmark-circle" size={56} color="#8B5CF6" style={{marginBottom: Spacing.md}} />
            <Text style={styles.completeTitle}>생성 완료!</Text>
            <Text style={styles.completeSubtitle}>
              {generatedTracks.length}개의 트랙이 생성되었습니다
            </Text>

            {/* 생성된 트랙 목록 */}
            <FlatList
              data={generatedTracks}
              keyExtractor={(item: GeneratedTrack) => item.id}
              renderItem={({ item }: { item: GeneratedTrack }) => (
                <TouchableOpacity
                  style={styles.trackItem}
                  onPress={() => handlePlayTrack(item)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{
                      uri:
                        item.thumbnailUrl ||
                        'https://via.placeholder.com/48',
                    }}
                    style={styles.trackThumb}
                  />
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                  <View style={styles.playBadge}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name="play" size={12} color="#FFFFFF" style={{marginRight: 2}} />
                      <Text style={styles.playBadgeText}>재생</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View style={{ height: Spacing.xs }} />
              )}
              style={styles.trackList}
            />
          </>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  content: {
    width: '85%',
    maxWidth: 360,
    alignItems: 'center',
    padding: Spacing.xl,
  },
  progressContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  spinner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderTopColor: '#8B5CF6',
    position: 'absolute',
  },
  spinnerTrack: {
    display: 'none',
  },
  spinnerFill: {
    display: 'none',
  },
  progressText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusText: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  tipContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.xl,
  },
  tipLabel: {
    ...Typography.caption,
    color: '#8B5CF6',
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  tipText: {
    ...Typography.body2,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  cancelButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelButtonText: {
    ...Typography.button,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  completeIcon: {
    fontSize: 56,
    marginBottom: Spacing.md,
  },
  completeTitle: {
    ...Typography.h2,
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  completeSubtitle: {
    ...Typography.body2,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: Spacing.lg,
  },
  trackList: {
    width: '100%',
    maxHeight: 240,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  trackThumb: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  trackInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  trackTitle: {
    ...Typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  playBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  playBadgeText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default GeneratingOverlay;
