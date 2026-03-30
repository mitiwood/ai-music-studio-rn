import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import {Colors, getThemeColors, Typography, Spacing, Radius} from '../../theme';
import {useAuthStore, useSettingsStore} from '../../stores';
import {APP_VERSION, PLAN_LIMITS} from '../../utils/constants';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  tc: ReturnType<typeof getThemeColors>;
}

const Section = ({title, children, tc}: SectionProps) => (
  <View style={styles.section}>
    <Text
      style={[
        Typography.captionBold,
        {color: tc.textMuted, marginBottom: Spacing.sm, paddingHorizontal: Spacing.lg},
      ]}>
      {title}
    </Text>
    <View style={[styles.sectionCard, {backgroundColor: tc.card, borderColor: tc.border}]}>
      {children}
    </View>
  </View>
);

interface RowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  tc: ReturnType<typeof getThemeColors>;
  danger?: boolean;
}

const Row = ({label, value, onPress, right, tc, danger}: RowProps) => (
  <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress && !right}>
    <Text style={[Typography.body, {color: danger ? Colors.error : tc.text}]}>{label}</Text>
    {right ||
      (value ? <Text style={[Typography.body, {color: tc.textSub}]}>{value}</Text> : null)}
  </TouchableOpacity>
);

export default function SettingsScreen({navigation}: any) {
  const {theme, language, notificationsEnabled, setTheme, setLanguage, toggleNotifications} =
    useSettingsStore();
  const tc = getThemeColors(theme);
  const {user, logout} = useAuthStore();

  const planInfo = PLAN_LIMITS[user?.plan || 'free'];

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠어요?', [
      {text: '취소', style: 'cancel'},
      {text: '로그아웃', style: 'destructive', onPress: logout},
    ]);
  };

  const handleExport = () => {
    Alert.alert('데이터 내보내기', '모든 곡 데이터를 내보냅니다.', [{text: '확인'}]);
  };

  const handleClearHistory = () => {
    Alert.alert('기록 초기화', '검색 기록과 최근 재생 목록을 삭제할까요?', [
      {text: '취소', style: 'cancel'},
      {text: '초기화', style: 'destructive', onPress: () => {}},
    ]);
  };

  const langLabels: Record<string, string> = {ko: '한국어', en: 'English', ja: '日本語'};
  const langOptions: Array<'ko' | 'en' | 'ja'> = ['ko', 'en', 'ja'];

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: tc.bg}]}
      contentContainerStyle={{paddingBottom: 100}}>
      <View style={styles.header}>
        <Text style={[Typography.h2, {color: tc.text}]}>설정</Text>
      </View>

      {/* Profile Section */}
      <TouchableOpacity
        style={[styles.profileCard, {backgroundColor: tc.card, borderColor: tc.border}]}>
        {user?.avatar ? (
          <Image source={{uri: user.avatar}} style={styles.profileAvatar} />
        ) : (
          <View
            style={[
              styles.profileAvatar,
              {backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center'},
            ]}>
            <Text style={{color: '#FFF', fontSize: 22, fontWeight: '800'}}>
              {user?.name?.[0] || '?'}
            </Text>
          </View>
        )}
        <View style={{flex: 1, marginLeft: Spacing.md}}>
          <Text style={[Typography.h3, {color: tc.text}]}>{user?.name || '게스트'}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
            <View style={[styles.planBadge, {backgroundColor: Colors.primary + '20'}]}>
              <Text style={[Typography.small, {color: Colors.primary, fontWeight: '700'}]}>
                {planInfo.label}
              </Text>
            </View>
            <Text style={[Typography.caption, {color: tc.textSub, marginLeft: Spacing.sm}]}>
              {user?.email || ''}
            </Text>
          </View>
        </View>
        <Text style={{color: tc.textMuted, fontSize: 18}}>›</Text>
      </TouchableOpacity>

      {/* Theme */}
      <Section title="테마" tc={tc}>
        <Row
          label="다크 모드"
          tc={tc}
          right={
            <Switch
              value={theme === 'dark'}
              onValueChange={v => setTheme(v ? 'dark' : 'light')}
              trackColor={{false: tc.border, true: Colors.primary}}
              thumbColor="#FFF"
            />
          }
        />
      </Section>

      {/* Language */}
      <Section title="언어" tc={tc}>
        {langOptions.map(l => (
          <Row
            key={l}
            label={langLabels[l]}
            tc={tc}
            onPress={() => setLanguage(l)}
            right={
              language === l ? (
                <Text style={{color: Colors.primary, fontSize: 18}}>✓</Text>
              ) : undefined
            }
          />
        ))}
      </Section>

      {/* Notifications */}
      <Section title="알림" tc={tc}>
        <Row
          label="푸시 알림"
          tc={tc}
          right={
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{false: tc.border, true: Colors.primary}}
              thumbColor="#FFF"
            />
          }
        />
      </Section>

      {/* Plan & Credits */}
      <Section title="플랜 & 크레딧" tc={tc}>
        <View style={styles.planRow}>
          <Text style={[Typography.body, {color: tc.text}]}>현재 플랜</Text>
          <Text style={[Typography.bodyBold, {color: Colors.primary}]}>{planInfo.label}</Text>
        </View>
        <View style={styles.usageBar}>
          <View style={[styles.usageBarBg, {backgroundColor: tc.surface}]}>
            <View style={[styles.usageBarFill, {width: '30%'}]} />
          </View>
          <Text style={[Typography.small, {color: tc.textMuted, marginTop: 4}]}>
            곡 생성 {planInfo.songs}곡 / 뮤비 {planInfo.mv}개 / 작사 {planInfo.lyrics}회
          </Text>
        </View>
        <TouchableOpacity
          style={styles.upgradeBtn}
          onPress={() => navigation?.navigate?.('Plan')}>
          <Text style={[Typography.button, {color: '#FFF'}]}>플랜 업그레이드</Text>
        </TouchableOpacity>
      </Section>

      {/* Music Stats */}
      <Section title="음악 통계" tc={tc}>
        <Row label="총 곡 수" value="0곡" tc={tc} />
        <Row label="받은 좋아요" value="0개" tc={tc} />
        <Row label="총 재생수" value="0회" tc={tc} />
      </Section>

      {/* Data */}
      <Section title="데이터" tc={tc}>
        <Row label="데이터 내보내기" tc={tc} onPress={handleExport} />
        <Row label="기록 초기화" tc={tc} onPress={handleClearHistory} danger />
      </Section>

      {/* About */}
      <Section title="정보" tc={tc}>
        <Row label="버전" value={APP_VERSION} tc={tc} />
        <Row
          label="개인정보 처리방침"
          tc={tc}
          onPress={() => Linking.openURL('https://ddinggok.com/privacy')}
        />
        <Row
          label="이용약관"
          tc={tc}
          onPress={() => Linking.openURL('https://ddinggok.com/terms')}
        />
      </Section>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={[Typography.button, {color: Colors.error}]}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.md},
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  profileAvatar: {width: 56, height: 56, borderRadius: 28},
  planBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.round,
  },
  section: {marginBottom: Spacing.lg},
  sectionCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  usageBar: {paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm},
  usageBarBg: {height: 6, borderRadius: 3, overflow: 'hidden'},
  usageBarFill: {height: 6, backgroundColor: Colors.primary, borderRadius: 3},
  upgradeBtn: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  logoutBtn: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.error,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
});
