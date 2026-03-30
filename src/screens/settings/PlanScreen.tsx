import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {Colors, getThemeColors, Typography, Spacing, Radius} from '../../theme';
import {useAuthStore, useSettingsStore} from '../../stores';
import {PLAN_LIMITS, API_BASE} from '../../utils/constants';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: '무료',
    features: [
      '매월 곡 생성 5회',
      '기본 장르 & 분위기',
      '커뮤니티 참여',
      '기본 음질',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9900,
    priceLabel: '9,900원/월',
    popular: true,
    features: [
      '매월 곡 생성 50회',
      '뮤직비디오 3개',
      'AI 작사 50회',
      '모든 장르 & 분위기',
      '고음질 다운로드',
      '우선 생성 큐',
    ],
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 19900,
    priceLabel: '19,900원/월',
    features: [
      '무제한 곡 생성',
      '뮤직비디오 20개',
      'AI 작사 무제한',
      '모든 프리미엄 기능',
      '상업적 사용 라이선스',
      '전용 고객 지원',
    ],
  },
];

const CREDIT_PACKS = [
  {id: 'pack10', label: '10곡 팩', count: 10, price: '1,900원'},
  {id: 'pack30', label: '30곡 팩', count: 30, price: '4,900원'},
  {id: 'pack100', label: '100곡 팩', count: 100, price: '12,900원'},
];

export default function PlanScreen() {
  const {theme} = useSettingsStore();
  const tc = getThemeColors(theme);
  const {user} = useAuthStore();
  const currentPlan = user?.plan || 'free';

  const handlePurchase = (_planId: string) => {
    Linking.openURL(`${API_BASE}/#pricing`);
  };

  const handleCreditPack = (_packId: string) => {
    Linking.openURL(`${API_BASE}/#pricing`);
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: tc.bg}]}
      contentContainerStyle={{paddingBottom: 100}}>
      <View style={styles.header}>
        <Text style={[Typography.h1, {color: tc.text}]}>플랜 & 가격</Text>
        <Text style={[Typography.body, {color: tc.textSub, marginTop: Spacing.xs}]}>
          나에게 맞는 플랜을 선택하세요
        </Text>
      </View>

      {/* Plan Cards */}
      {PLANS.map(plan => {
        const isCurrent = currentPlan === plan.id;
        return (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              {backgroundColor: tc.card, borderColor: isCurrent ? Colors.primary : tc.border},
              plan.popular && styles.popularCard,
            ]}>
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={[Typography.small, {color: '#FFF', fontWeight: '700'}]}>인기</Text>
              </View>
            )}
            <Text style={[Typography.h2, {color: tc.text}]}>{plan.name}</Text>
            <Text style={[Typography.h1, {color: Colors.primary, marginVertical: Spacing.sm}]}>
              {plan.priceLabel}
            </Text>
            {plan.features.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={{color: Colors.success, marginRight: Spacing.sm}}>✓</Text>
                <Text style={[Typography.body, {color: tc.text, flex: 1}]}>{f}</Text>
              </View>
            ))}
            <View style={{marginTop: Spacing.md}}>
              <Text style={[Typography.small, {color: tc.textMuted}]}>
                곡 {PLAN_LIMITS[plan.id].songs}회 · 뮤비 {PLAN_LIMITS[plan.id].mv}개 · 작사{' '}
                {PLAN_LIMITS[plan.id].lyrics}회
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.planBtn,
                isCurrent ? {backgroundColor: tc.surface} : {backgroundColor: Colors.primary},
              ]}
              onPress={() => !isCurrent && handlePurchase(plan.id)}
              disabled={isCurrent}>
              <Text style={[Typography.button, {color: isCurrent ? tc.textSub : '#FFF'}]}>
                {isCurrent ? '현재 플랜' : plan.price === 0 ? '시작하기' : '구독하기'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* Credit Packs */}
      <View style={styles.creditSection}>
        <Text style={[Typography.h3, {color: tc.text, marginBottom: Spacing.md}]}>크레딧 팩</Text>
        <Text style={[Typography.caption, {color: tc.textSub, marginBottom: Spacing.lg}]}>
          플랜과 별도로 추가 곡 생성 크레딧을 구매할 수 있어요
        </Text>
        {CREDIT_PACKS.map(pack => (
          <TouchableOpacity
            key={pack.id}
            style={[styles.creditCard, {backgroundColor: tc.card, borderColor: tc.border}]}
            onPress={() => handleCreditPack(pack.id)}>
            <View style={{flex: 1}}>
              <Text style={[Typography.bodyBold, {color: tc.text}]}>{pack.label}</Text>
              <Text style={[Typography.caption, {color: tc.textSub}]}>
                {pack.count}곡 생성 가능
              </Text>
            </View>
            <View style={styles.creditPrice}>
              <Text style={[Typography.bodyBold, {color: Colors.primary}]}>{pack.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.lg},
  planCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  popularCard: {borderWidth: 2, borderColor: Colors.primary},
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: Spacing.xl,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.round,
  },
  featureRow: {flexDirection: 'row', alignItems: 'center', marginVertical: 3},
  planBtn: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  creditSection: {paddingHorizontal: Spacing.lg, marginTop: Spacing.lg},
  creditCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  creditPrice: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
});
