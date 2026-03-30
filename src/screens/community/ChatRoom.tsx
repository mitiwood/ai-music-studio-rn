import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, getThemeColors, Typography, Spacing, Radius} from '../../theme';
import {useChatStore, useAuthStore, useSettingsStore} from '../../stores';
import {ChatMessage} from '../../api';
import {usePolling} from '../../hooks/usePolling';

export default function ChatRoom() {
  const {theme} = useSettingsStore();
  const tc = getThemeColors(theme);
  const {messages, isLoading, onlineCount, typingUsers, loadMessages, sendMessage, deleteMessage} =
    useChatStore();
  const {user} = useAuthStore();
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<{id: string; name: string} | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = useCallback(() => {
    if (user) {
      loadMessages(user.name, user.provider);
    } else {
      loadMessages();
    }
  }, [user, loadMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  usePolling(fetchMessages, 5000, true);

  const handleSend = async () => {
    if (!text.trim() || !user) return;
    const content = text.trim();
    setText('');
    const rp = replyTo || undefined;
    setReplyTo(null);
    await sendMessage(content, user.name, user.avatar || '', user.provider, rp);
    fetchMessages();
  };

  const handleLongPress = (msg: ChatMessage) => {
    if (!user) return;
    const isOwn = msg.author_name === user.name && msg.author_provider === user.provider;
    const options: {text: string; onPress: () => void; style?: 'cancel' | 'destructive'}[] = [
      {text: '답장', onPress: () => setReplyTo({id: msg.id, name: msg.author_name})},
    ];
    if (isOwn) {
      options.push({
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          Alert.alert('메시지 삭제', '이 메시지를 삭제할까요?', [
            {text: '취소', style: 'cancel'},
            {
              text: '삭제',
              style: 'destructive',
              onPress: () => deleteMessage(msg.id, user.name, user.provider),
            },
          ]);
        },
      });
    }
    Alert.alert('메시지', undefined, [
      ...options,
      {text: '취소', style: 'cancel'},
    ]);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderMessage = ({item}: {item: ChatMessage}) => {
    const isOwn =
      user != null &&
      item.author_name === user.name &&
      item.author_provider === user.provider;
    return (
      <TouchableOpacity
        style={[styles.msgRow, isOwn && styles.msgRowOwn]}
        onLongPress={() => handleLongPress(item)}
        activeOpacity={0.7}>
        {!isOwn &&
          (item.author_avatar ? (
            <Image source={{uri: item.author_avatar}} style={styles.msgAvatar} />
          ) : (
            <View
              style={[
                styles.msgAvatar,
                {backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center'},
              ]}>
              <Text style={{color: '#FFF', fontSize: 12, fontWeight: '700'}}>
                {item.author_name?.[0]}
              </Text>
            </View>
          ))}
        <View
          style={[styles.msgBubble, isOwn ? styles.msgBubbleOwn : {backgroundColor: tc.surface}]}>
          {!isOwn && (
            <Text style={[Typography.captionBold, {color: Colors.primary, marginBottom: 2}]}>
              {item.author_name}
            </Text>
          )}
          {item.reply_to && (
            <View style={styles.replyIndicator}>
              <Text style={[Typography.small, {color: Colors.primaryLight}]} numberOfLines={1}>
                ↩ {item.reply_to.name}에게 답장
              </Text>
            </View>
          )}
          <Text style={[Typography.body, {color: isOwn ? '#FFF' : tc.text}]}>{item.content}</Text>
          <Text
            style={[
              Typography.small,
              {
                color: isOwn ? 'rgba(255,255,255,0.6)' : tc.textMuted,
                alignSelf: 'flex-end',
                marginTop: 2,
              },
            ]}>
            {formatTime(item.created_at)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: tc.bg}]}>
      {/* Online badge */}
      <View style={styles.onlineBadge}>
        <View style={styles.onlineDot} />
        <Text style={[Typography.caption, {color: tc.textSub}]}>{onlineCount}명 온라인</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={styles.msgList}
        onEndReached={fetchMessages}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator color={Colors.primary} style={{marginTop: 40}} />
          ) : (
            <View style={{alignItems: 'center', marginTop: 40}}>
              <Text style={[Typography.body, {color: tc.textSub}]}>
                첫 번째 메시지를 보내보세요!
              </Text>
            </View>
          )
        }
      />

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <View style={styles.typingRow}>
          <Text style={[Typography.small, {color: tc.textMuted, fontStyle: 'italic'}]}>
            {typingUsers.join(', ')}님이 입력 중...
          </Text>
        </View>
      )}

      {/* Reply indicator */}
      {replyTo && (
        <View style={[styles.replyBar, {backgroundColor: tc.surface, borderColor: Colors.primary}]}>
          <Text style={[Typography.caption, {color: Colors.primary, flex: 1}]}>
            ↩ {replyTo.name}에게 답장
          </Text>
          <TouchableOpacity onPress={() => setReplyTo(null)}>
            <Icon name="close" size={18} color={tc.textMuted} />
          </TouchableOpacity>
        </View>
      )}

      {/* Input */}
      <View style={[styles.inputRow, {backgroundColor: tc.card, borderTopColor: tc.border}]}>
        <TextInput
          style={[styles.input, {backgroundColor: tc.surface, color: tc.text}]}
          placeholder="메시지를 입력하세요..."
          placeholderTextColor={tc.textMuted}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !text.trim() && {opacity: 0.4}]}
          onPress={handleSend}
          disabled={!text.trim()}>
          <Text style={styles.sendBtnText}>전송</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: Spacing.xs,
  },
  msgList: {paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm},
  msgRow: {flexDirection: 'row', marginBottom: Spacing.sm, alignItems: 'flex-end'},
  msgRowOwn: {flexDirection: 'row-reverse'},
  msgAvatar: {width: 32, height: 32, borderRadius: 16, marginRight: Spacing.sm},
  msgBubble: {
    maxWidth: '75%',
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },
  msgBubbleOwn: {
    backgroundColor: Colors.primary,
    marginLeft: Spacing.sm,
  },
  replyIndicator: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.primaryLight,
    paddingLeft: Spacing.sm,
    marginBottom: 4,
  },
  typingRow: {paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xs},
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderLeftWidth: 3,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.sm,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    maxHeight: 100,
    fontSize: 15,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.round,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginLeft: Spacing.sm,
    justifyContent: 'center',
  },
  sendBtnText: {color: '#FFF', fontSize: 13, fontWeight: '600'},
});
