import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '../theme/colors';
import {Typography} from '../theme/typography';
import {Spacing, Radius} from '../theme/spacing';

interface TrackListItemProps {
  thumbnail?: string;
  title: string;
  artist: string;
  duration?: string;
  likeCount?: number;
  playCount?: number;
  onPress?: () => void;
  onLike?: () => void;
  onMore?: () => void;
}

export const TrackListItem: React.FC<TrackListItemProps> = ({
  thumbnail,
  title,
  artist,
  duration,
  likeCount = 0,
  playCount = 0,
  onPress,
  onLike,
  onMore,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}>
      <View style={styles.thumbnail}>
        {thumbnail ? (
          <Image source={{uri: thumbnail}} style={styles.thumbnailImg} />
        ) : (
          <View style={styles.thumbnailFallback}>
            <Text style={styles.thumbnailIcon}>{'\ud83c\udfb5'}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[Typography.bodyBold, styles.title]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[Typography.caption, styles.artist]} numberOfLines={1}>
          {artist}
        </Text>
        <View style={styles.stats}>
          {duration && (
            <Text style={[Typography.small, styles.stat]}>{duration}</Text>
          )}
          <Text style={[Typography.small, styles.stat]}>
            {'\u25b6'} {playCount.toLocaleString()}
          </Text>
          <Text style={[Typography.small, styles.stat]}>
            {'\u2764\ufe0f'} {likeCount.toLocaleString()}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        {onLike && (
          <TouchableOpacity onPress={onLike} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>{'\u2764\ufe0f'}</Text>
          </TouchableOpacity>
        )}
        {onMore && (
          <TouchableOpacity onPress={onMore} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>{'\u22ee'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  thumbnailFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailIcon: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  title: {
    color: Colors.text1,
  },
  artist: {
    color: Colors.text2,
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: Spacing.md,
  },
  stat: {
    color: Colors.text3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionBtn: {
    padding: Spacing.sm,
  },
  actionIcon: {
    fontSize: 16,
  },
});
