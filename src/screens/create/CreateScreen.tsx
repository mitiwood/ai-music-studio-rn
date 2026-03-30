import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { useMusicStore } from '../../stores/useMusicStore';
import CustomMode from './CustomMode';
import SimpleMode from './SimpleMode';
import YouTubeMode from './YouTubeMode';
import MVMode from './MVMode';
import GeneratingOverlay from './GeneratingOverlay';

type TabKey = 'custom' | 'simple' | 'youtube' | 'mv';

interface Tab {
  key: TabKey;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { key: 'custom', label: '커스텀', icon: '🎛️' },
  { key: 'simple', label: '심플', icon: '✨' },
  { key: 'youtube', label: 'YouTube', icon: '📺' },
  { key: 'mv', label: 'MV', icon: '🎬' },
];

const CreateScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('custom');
  const { isGenerating, generate, generateParams } = useMusicStore();

  const handleGenerate = async () => {
    await generate(generateParams);
  };

  const renderModeContent = () => {
    switch (activeTab) {
      case 'custom':
        return <CustomMode />;
      case 'simple':
        return <SimpleMode />;
      case 'youtube':
        return <YouTubeMode />;
      case 'mv':
        return <MVMode />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* 모드 탭 */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.key && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 모드 콘텐츠 */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderModeContent()}
        {/* 플로팅 버튼 아래 여백 */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 플로팅 생성 버튼 (shimmer purple gradient) */}
      <TouchableOpacity
        style={styles.generateButtonWrapper}
        onPress={handleGenerate}
        activeOpacity={0.85}
        disabled={isGenerating}
      >
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED', '#6B21A8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.generateButton}
        >
          <Text style={styles.generateButtonText}>
            {isGenerating ? '생성 중...' : '🎵 음악 생성하기'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* 생성 중 오버레이 */}
      {isGenerating && <GeneratingOverlay />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: Colors.primaryLight,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  generateButtonWrapper: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  generateButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
  },
  generateButtonText: {
    ...Typography.button,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default CreateScreen;
