import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Colors, getThemeColors, Typography, Spacing, Radius} from '../../theme';
import {useAuthStore, useSettingsStore} from '../../stores';
import {authApi, tracksApi, Track} from '../../api';

interface ProfileData {
  name: string;
  provider: string;
  avatar?: string;
  trackCount?: number;
  totalLikes?: number;
  totalPlays?: number;
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

const TABS = [
  {id: 'tracks', label: '트랙'},
  {id: 'liked', label: '좋아요'},
];

export default function ProfileScreen({route}: any) {
  const {theme} = useSettingsStore();
  const tc = getThemeColors(theme);
  const {user} = useAuthStore();
  const targetName: string = route?.params?.name || user?.name || '';
  const targetProvider: string = route?.params?.provider || user?.provider || '';

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [tab, setTab] = useState('tracks');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = user?.name === targetName && user?.provider === targetProvider;

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authApi.getProfile(targetName, targetProvider);
      setProfile(data);
      setIsFollowing(data.isFollowing || false);

      const userTracks = await tracksApi.getUserTracks(targetName, targetProvider);
      setTracks(userTracks);

      if (user) {
        const likes = await tracksApi.getMyLikes(targetName, targetProvider);
        setLikedTracks(likes);
      }
    } catch (e) {
      console.error('프로필 로드 실패:', e);
    } finally {
      setLoading(false);
    }
  }, [targetName, targetProvider, user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleFollow = async () => {
    if (!user || isOwnProfile) return;
    try {
      if (isFollowing) {
        await authApi.unfollow(user.name, user.provider, targetName, targetProvider);
        setIsFollowing(false);
      } else {
        await authApi.follow(user.name, user.provider, targetName, targetProvider);
        setIsFollowing(true);
      }
    } catch (e) {
      console.error('팔로우 실패:', e);
    }
  };

  const providerBadge = (p: string) => {
    const labels: Record<string, string> = {
      google: 'Google',
      kakao: '카카오',
      naver: '네이버',
      guest: '게스트',
    };
    return labels[p] || p;
  };

  const renderTrack = ({item}: {item: Track}) => (
    <TouchableOpacity style={[styles.trackItem, {backgroundColor: tc.card, borderColor: tc.border}]}>
      <View style={[styles.trackCover, {backgroundColor: Colors.surfaceDark}]}>
        {item.image_url && <Image source={{uri: item.image_url}} style={styles.trackCover} />}
      </View>
      <View style={{flex: 1, marginLeft: Spacing.md}}>
        <Text style={[Typography.bodyBold, {color: tc.text}]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[Typography.small, {color: tc.textMuted, marginTop: 2}]}>
          ▶ {item.comm_plays || 0}  ♥ {item.comm_likes || 0}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: tc.bg, justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: tc.bg}]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadProfile} tintColor={Colors.primary} />
      }>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        {profile?.avatar ? (
          <Image source={{uri: profile.avatar}} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatar,
              {backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center'},
            ]}>
            <Text style={{color: '#FFF', fontSize: 28, fontWeight: '800'}}>
              {targetName?.[0]}
            </Text>
          </View>
        )}
        <Text style={[Typography.h2, {color: tc.text, marginTop: Spacing.md}]}>{targetName}</Text>
        <View style={[styles.providerBadge, {backgroundColor: Colors.primary + '20'}]}>
          <Text style={[Typography.small, {color: Colors.primary}]}>
            {providerBadge(targetProvider)}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          {label: '트랙', value: profile?.trackCount || tracks.length},
          {label: '좋아요', value: profile?.totalLikes || 0},
          {label: '재생', value: profile?.totalPlays || 0},
          {label: '팔로워', value: profile?.followerCount || 0},
        ].map(s => (
          <View key={s.label} style={styles.statItem}>
            <Text style={[Typography.h3, {color: tc.text}]}>{s.value}</Text>
            <Text style={[Typography.small, {color: tc.textSub}]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      {!isOwnProfile && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.followBtn, isFollowing && styles.followBtnActive]}
            onPress={handleFollow}>
            <Text style={[Typography.button, {color: isFollowing ? Colors.primary : '#FFF'}]}>
              {isFollowing ? '팔로잉' : '팔로우'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dmBtn, {borderColor: tc.border}]}>
            <Text style={[Typography.button, {color: tc.text}]}>메시지</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tabs */}
      <View style={[styles.tabRow, {borderBottomColor: tc.border}]}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tab, tab === t.id && styles.tabActive]}
            onPress={() => setTab(t.id)}>
            <Text
              style={[Typography.bodyBold, {color: tab === t.id ? Colors.primary : tc.textSub}]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Track List */}
      <FlatList
        data={tab === 'tracks' ? tracks : likedTracks}
        keyExtractor={item => item.id}
        renderItem={renderTrack}
        scrollEnabled={false}
        contentContainerStyle={{paddingHorizontal: Spacing.lg, paddingBottom: 100}}
        ListEmptyComponent={
          <View style={{alignItems: 'center', paddingTop: 40}}>
            <Text style={[Typography.body, {color: tc.textSub}]}>
              {tab === 'tracks' ? '아직 곡이 없어요' : '좋아요한 곡이 없어요'}
            </Text>
          </View>
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  profileHeader: {
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.lg,
  },
  avatar: {width: 80, height: 80, borderRadius: 40},
  providerBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.round,
    marginTop: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  statItem: {alignItems: 'center'},
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  followBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  followBtnActive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dmBtn: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  tabRow: {flexDirection: 'row', borderBottomWidth: 1, marginHorizontal: Spacing.lg},
  tab: {flex: 1, alignItems: 'center', paddingVertical: Spacing.md},
  tabActive: {borderBottomWidth: 2, borderBottomColor: Colors.primary},
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  trackCover: {width: 50, height: 50, borderRadius: Radius.sm},
});
