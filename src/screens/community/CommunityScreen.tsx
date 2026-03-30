import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import {Colors, getThemeColors, Typography, Spacing, Radius} from '../../theme';
import {useCommunityStore, useAuthStore, useSettingsStore} from '../../stores';
import {Track} from '../../api';
import ChatRoom from './ChatRoom';

const FILTERS = [
  {id: 'all', label: '전체'},
  {id: 'top', label: '인기'},
  {id: 'following', label: '팔로잉'},
  {id: 'chat', label: '채팅'},
  {id: 'kpop', label: 'K-Pop'},
  {id: 'hiphop', label: 'Hip-Hop'},
  {id: 'lofi', label: 'Lo-Fi'},
  {id: 'electronic', label: 'Electronic'},
];

const SORT_OPTIONS = [
  {id: 'latest', label: '최신순'},
  {id: 'likes', label: '좋아요순'},
  {id: 'rating', label: '평점순'},
];

const StarRating = ({rating}: {rating: number}) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text key={i} style={{fontSize: 12, color: i <= rating ? Colors.warning : Colors.text2}}>
        ★
      </Text>,
    );
  }
  return <View style={{flexDirection: 'row'}}>{stars}</View>;
};

export default function CommunityScreen() {
  const {theme} = useSettingsStore();
  const tc = getThemeColors(theme);
  const {tracks, isLoading, sort, filter, loadTracks, setFilter, likeTrack} = useCommunityStore();
  const {user} = useAuthStore();
  const [search, setSearch] = useState('');
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  const onRefresh = useCallback(() => {
    loadTracks(sort);
  }, [sort, loadTracks]);

  const handleSort = (s: string) => {
    setShowSort(false);
    loadTracks(s);
  };

  const filteredTracks = tracks.filter(t => {
    if (search) {
      const q = search.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.owner_name.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filter === 'all' || filter === 'chat') return true;
    if (filter === 'top') return (t.comm_likes || 0) >= 5;
    if (filter === 'following') return false; // TODO: filter by following list
    if (t.tags) return t.tags.toLowerCase().includes(filter);
    return true;
  });

  if (filter === 'chat') {
    return (
      <View style={[styles.container, {backgroundColor: tc.bg}]}>
        <View style={styles.header}>
          <Text style={[Typography.h2, {color: tc.text}]}>커뮤니티</Text>
        </View>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={f => f.id}
          showsHorizontalScrollIndicator={false}
          style={styles.filterList}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[styles.filterChip, filter === item.id && styles.filterChipActive]}
              onPress={() => setFilter(item.id)}>
              <Text style={[styles.filterText, filter === item.id && styles.filterTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
        <ChatRoom />
      </View>
    );
  }

  const renderTrack = ({item}: {item: Track}) => (
    <TouchableOpacity
      style={[styles.trackCard, {backgroundColor: tc.card, borderColor: tc.border}]}>
      <Image
        source={item.image_url ? {uri: item.image_url} : undefined}
        style={styles.trackCover}
        defaultSource={undefined}
      />
      <View style={styles.trackInfo}>
        <Text style={[Typography.bodyBold, {color: tc.text}]} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.artistRow}>
          {item.owner_avatar ? (
            <Image source={{uri: item.owner_avatar}} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, {backgroundColor: Colors.primary}]}>
              <Text style={styles.avatarText}>{item.owner_name?.[0]}</Text>
            </View>
          )}
          <Text style={[Typography.caption, {color: tc.textSub, marginLeft: Spacing.xs}]}>
            {item.owner_name}
          </Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={[Typography.small, {color: tc.textMuted}]}>
            ▶ {item.comm_plays || 0}
          </Text>
          <Text style={[Typography.small, {color: tc.textMuted, marginLeft: Spacing.sm}]}>
            ♥ {item.comm_likes || 0}
          </Text>
          <View style={{marginLeft: Spacing.sm}}>
            <StarRating rating={Math.round(item.comm_rating || 0)} />
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.likeBtn}
        onPress={() => user && likeTrack(item.id, user.name, user.provider)}>
        <Text style={{fontSize: 20, color: Colors.accent}}>♥</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {backgroundColor: tc.bg}]}>
      <View style={styles.header}>
        <Text style={[Typography.h2, {color: tc.text}]}>커뮤니티</Text>
      </View>

      {/* Search bar */}
      <View style={[styles.searchBar, {backgroundColor: tc.surface, borderColor: tc.border}]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[Typography.body, {color: tc.text, flex: 1, padding: 0}]}
          placeholder="곡 또는 아티스트 검색..."
          placeholderTextColor={tc.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter tabs */}
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={f => f.id}
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[styles.filterChip, filter === item.id && styles.filterChipActive]}
            onPress={() => setFilter(item.id)}>
            <Text style={[styles.filterText, filter === item.id && styles.filterTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Track list */}
      <FlatList
        data={filteredTracks}
        keyExtractor={item => item.id}
        renderItem={renderTrack}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={[Typography.body, {color: tc.textSub, textAlign: 'center'}]}>
                아직 공유된 곡이 없어요
              </Text>
            </View>
          ) : null
        }
      />

      {/* Sort FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowSort(!showSort)}>
        <Text style={styles.fabText}>정렬</Text>
      </TouchableOpacity>

      {showSort && (
        <View style={[styles.sortMenu, {backgroundColor: tc.card, borderColor: tc.border}]}>
          {SORT_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.sortItem, sort === opt.id && {backgroundColor: Colors.primary + '20'}]}
              onPress={() => handleSort(opt.id)}>
              <Text
                style={[Typography.body, {color: sort === opt.id ? Colors.primary : tc.text}]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.sm},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchIcon: {fontSize: 16, marginRight: Spacing.sm},
  filterList: {
    maxHeight: 48,
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.round,
    backgroundColor: Colors.surfaceDark,
    marginRight: Spacing.sm,
    height: 36,
    justifyContent: 'center',
  },
  filterChipActive: {backgroundColor: Colors.primary},
  filterText: {fontSize: 13, fontWeight: '600', color: Colors.text2},
  filterTextActive: {color: '#FFFFFF'},
  listContent: {paddingHorizontal: Spacing.lg, paddingBottom: 100},
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  trackCover: {
    width: 60,
    height: 60,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceDark,
  },
  trackInfo: {flex: 1, marginLeft: Spacing.md},
  artistRow: {flexDirection: 'row', alignItems: 'center', marginTop: 2},
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {color: '#FFF', fontSize: 10, fontWeight: '700'},
  statsRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  likeBtn: {padding: Spacing.sm},
  empty: {paddingTop: 60, alignItems: 'center'},
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: Colors.primary,
    borderRadius: Radius.round,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {fontSize: 13, fontWeight: '600', color: '#FFF'},
  sortMenu: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  sortItem: {paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md},
});
