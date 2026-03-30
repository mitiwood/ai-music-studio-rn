import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { useMusicStore } from '../../stores/useMusicStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { musicApi } from '../../api';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl?: string;
  duration: number;
}

const MVMode: React.FC = () => {
  const { setGenerateParams } = useMusicStore();
  const { user } = useAuthStore();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [visualPrompt, setVisualPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 사용자 트랙 목록 불러오기
  useEffect(() => {
    const loadTracks = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const result = await musicApi.getUserTracks(user.id);
        setTracks(result || []);
      } catch (_e) {
        // 에러 처리
      } finally {
        setIsLoading(false);
      }
    };
    loadTracks();
  }, [user?.id]);

  // 파라미터 동기화
  useEffect(() => {
    if (selectedTrack) {
      setGenerateParams({
        mode: 'mv',
        trackId: selectedTrack.id,
        visualPrompt,
      });
    }
  }, [selectedTrack, visualPrompt]);

  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const renderTrackItem = ({ item }: { item: Track }) => {
    const isSelected = selectedTrack?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.trackItem, isSelected && styles.trackItemSelected]}
        onPress={() => setSelectedTrack(item)}
        activeOpacity={0.7}
      >
        <Image
          source={{
            uri: item.thumbnailUrl || 'https://via.placeholder.com/48',
          }}
          style={styles.trackThumb}
        />
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.artist} · {formatDuration(item.duration)}
          </Text>
        </View>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>선택됨</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 트랙 선택 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>트랙 선택</Text>
        <Text style={styles.sectionHint}>
          MV를 만들 곡을 선택하세요
        </Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>트랙 불러오는 중...</Text>
          </View>
        ) : tracks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎵</Text>
            <Text style={styles.emptyText}>
              아직 생성한 곡이 없습니다
            </Text>
            <Text style={styles.emptyHint}>
              먼저 커스텀 또는 심플 모드에서 곡을 생성해주세요
            </Text>
          </View>
        ) : (
          <FlatList
            data={tracks}
            keyExtractor={(item) => item.id}
            renderItem={renderTrackItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={styles.trackList}
          />
        )}
      </View>

      {/* 비주얼 스타일 프롬프트 */}
      {selectedTrack && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>비주얼 스타일</Text>
            <TextInput
              style={styles.promptInput}
              placeholder="원하는 뮤직비디오 스타일을 설명해주세요... (예: 네온 도시 야경, 사이버펑크 분위기)"
              placeholderTextColor={Colors.textTertiary}
              value={visualPrompt}
              onChangeText={setVisualPrompt}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* 미리보기 썸네일 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>미리보기</Text>
            <View style={styles.previewCard}>
              <Image
                source={{
                  uri:
                    selectedTrack.thumbnailUrl ||
                    'https://via.placeholder.com/320x180',
                }}
                style={styles.previewImage}
              />
              <View style={styles.previewOverlay}>
                <Text style={styles.previewTitle}>{selectedTrack.title}</Text>
                <Text style={styles.previewArtist}>
                  {selectedTrack.artist}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sectionHint: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  trackList: {
    maxHeight: 300,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trackItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  trackThumb: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    backgroundColor: Colors.border,
  },
  trackInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  trackTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  trackArtist: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  selectedBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  selectedBadgeText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 11,
  },
  separator: {
    height: Spacing.xs,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  emptyHint: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  promptInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    ...Typography.body,
    minHeight: 100,
    maxHeight: 180,
  },
  previewCard: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewImage: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.border,
  },
  previewOverlay: {
    padding: Spacing.md,
  },
  previewTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
  },
  previewArtist: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default MVMode;
