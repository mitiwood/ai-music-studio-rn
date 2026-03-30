import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {Colors, getThemeColors, Typography, Spacing, Radius} from '../../theme';
import {useAuthStore, useSettingsStore} from '../../stores';
import {tracksApi, Track} from '../../api';

const TABS = [
  {id: 'all', label: '전체'},
  {id: 'my', label: '내 곡'},
  {id: 'liked', label: '좋아요'},
  {id: 'playlist', label: '재생목록'},
];

const SORTS = [
  {id: 'newest', label: '최신순'},
  {id: 'oldest', label: '오래된순'},
  {id: 'likes', label: '좋아요순'},
];

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const GRID_ITEM_WIDTH = (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.sm) / 2;

export default function LibraryScreen() {
  const {theme} = useSettingsStore();
  const tc = getThemeColors(theme);
  const {user} = useAuthStore();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const loadData = useCallback(async () => {
    if (!user || user.provider === 'guest') {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const userTracks = await tracksApi.getUserTracks(user.name, user.provider);
      setTracks(userTracks);
      const likes = await tracksApi.getMyLikes(user.name, user.provider);
      setLikedTracks(likes);
    } catch (e) {
      console.error('라이브러리 로드 실패:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = (track: Track) => {
    if (!user) return;
    Alert.alert('곡 삭제', `"${track.title}"을(를) 삭제할까요?`, [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await tracksApi.deleteTrack(track.id, user.name, user.provider);
          loadData();
        },
      },
    ]);
  };

  const handleShare = (_track: Track) => {
    // TODO: implement sharing
  };

  const getFilteredTracks = () => {
    let list: Track[] = [];
    if (tab === 'all' || tab === 'my') list = tracks;
    else if (tab === 'liked') list = likedTracks;
    else list = []; // playlist - placeholder

    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'newest') {
        return (
          new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        );
      }
      if (sortBy === 'oldest') {
        return (
          new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
        );
      }
      return (b.comm_likes || 0) - (a.comm_likes || 0);
    });
    return sorted;
  };

  const renderListItem = ({item}: {item: Track}) => (
    <TouchableOpacity
      style={[styles.listItem, {backgroundColor: tc.card, borderColor: tc.border}]}
      onLongPress={() => handleDelete(item)}>
      <View style={[styles.listCover, {backgroundColor: Colors.surfaceDark}]}>
        {item.image_url && <Image source={{uri: item.image_url}} style={styles.listCover} />}
      </View>
      <View style={styles.listInfo}>
        <Text style={[Typography.bodyBold, {color: tc.text}]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[Typography.caption, {color: tc.textSub}]}>{item.owner_name}</Text>
        <Text style={[Typography.small, {color: tc.textMuted}]}>
          ▶ {item.comm_plays || 0}  ♥ {item.comm_likes || 0}
        </Text>
      </View>
      <TouchableOpacity style={styles.moreBtn} onPress={() => handleDelete(item)}>
        <Text style={{color: tc.textMuted, fontSize: 20}}>⋯</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderGridItem = ({item}: {item: Track}) => (
    <TouchableOpacity
      style={[styles.gridItem, {backgroundColor: tc.card, borderColor: tc.border}]}
      onLongPress={() => handleDelete(item)}>
      <View style={[styles.gridCover, {backgroundColor: Colors.surfaceDark}]}>
        {item.image_url && (
          <Image source={{uri: item.image_url}} style={styles.gridCover} />
        )}
      </View>
      <Text
        style={[Typography.captionBold, {color: tc.text, marginTop: Spacing.sm}]}
        numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[Typography.small, {color: tc.textMuted}]}>♥ {item.comm_likes || 0}</Text>
    </TouchableOpacity>
  );

  const data = getFilteredTracks();

  return (
    <View style={[styles.container, {backgroundColor: tc.bg}]}>
      <View style={styles.header}>
        <Text style={[Typography.h2, {color: tc.text}]}>라이브러리</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabRow, {borderBottomColor: tc.border}]}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tab, tab === t.id && styles.tabActive]}
            onPress={() => setTab(t.id)}>
            <Text
              style={[Typography.captionBold, {color: tab === t.id ? Colors.primary : tc.textSub}]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort + View Toggle */}
      <View style={styles.controlRow}>
        <View style={styles.sortRow}>
          {SORTS.map(s => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.sortChip,
                sortBy === s.id && {backgroundColor: Colors.primary + '20'},
              ]}
              onPress={() => setSortBy(s.id)}>
              <Text
                style={[
                  Typography.small,
                  {color: sortBy === s.id ? Colors.primary : tc.textSub},
                ]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={() => setViewMode(v => (v === 'list' ? 'grid' : 'list'))}>
          <Text style={{fontSize: 20, color: tc.textSub}}>
            {viewMode === 'list' ? '▦' : '☰'}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{marginTop: 60}} />
      ) : data.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{fontSize: 48, marginBottom: Spacing.lg}}>🎵</Text>
          <Text style={[Typography.h3, {color: tc.text, marginBottom: Spacing.sm}]}>
            아직 곡이 없어요
          </Text>
          <Text
            style={[
              Typography.body,
              {color: tc.textSub, textAlign: 'center', marginBottom: Spacing.xl},
            ]}>
            첫 번째 곡을 만들어보세요!
          </Text>
          <TouchableOpacity style={styles.ctaBtn}>
            <Text style={[Typography.button, {color: '#FFF'}]}>곡 만들기</Text>
          </TouchableOpacity>
        </View>
      ) : viewMode === 'list' ? (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderListItem}
          contentContainerStyle={{paddingHorizontal: Spacing.lg, paddingBottom: 100}}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadData}
              tintColor={Colors.primary}
            />
          }
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderGridItem}
          numColumns={2}
          columnWrapperStyle={{gap: Spacing.sm}}
          contentContainerStyle={{
            paddingHorizontal: Spacing.lg,
            paddingBottom: 100,
            gap: Spacing.sm,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadData}
              tintColor={Colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.sm},
  tabRow: {flexDirection: 'row', borderBottomWidth: 1, marginHorizontal: Spacing.lg},
  tab: {flex: 1, alignItems: 'center', paddingVertical: Spacing.md},
  tabActive: {borderBottomWidth: 2, borderBottomColor: Colors.primary},
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  sortRow: {flexDirection: 'row', gap: Spacing.xs},
  sortChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.round,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  listCover: {width: 56, height: 56, borderRadius: Radius.sm},
  listInfo: {flex: 1, marginLeft: Spacing.md},
  moreBtn: {padding: Spacing.sm},
  gridItem: {
    width: GRID_ITEM_WIDTH,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  gridCover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radius.sm,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.md,
  },
});
