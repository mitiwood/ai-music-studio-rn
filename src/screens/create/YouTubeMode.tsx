import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { useMusicStore } from '../../stores';
import { musicApi } from '../../api';

interface AnalysisResult {
  title: string;
  bpm: number;
  key: string;
  mood: string;
  genre: string;
  duration: string;
}

const STYLE_OPTIONS = [
  { key: 'original', label: '원본 스타일 유지' },
  { key: 'acoustic', label: '어쿠스틱 버전' },
  { key: 'lofi', label: 'Lo-Fi 리메이크' },
  { key: 'edm', label: 'EDM 리믹스' },
  { key: 'jazz', label: '재즈 편곡' },
  { key: 'rock', label: '록 커버' },
];

const YouTubeMode: React.FC = () => {
  const { setGenerateParams } = useMusicStore();

  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('original');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!youtubeUrl.trim()) return;
    setError(null);
    setIsAnalyzing(true);
    try {
      const result = await musicApi.analyzeYoutube(youtubeUrl);
      setAnalysis(result);
    } catch (e: any) {
      setError(e.message || '분석에 실패했습니다. URL을 확인해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (analysis) {
      setGenerateParams({
        mode: 'youtube',
        youtubeUrl,
        analysis,
        style: selectedStyle,
      });
    }
  }, [analysis, selectedStyle]);

  return (
    <View style={styles.container}>
      {/* URL 입력 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YouTube URL</Text>
        <View style={styles.urlRow}>
          <TextInput
            style={styles.urlInput}
            placeholder="https://youtube.com/watch?v=..."
            placeholderTextColor={Colors.textTertiary}
            value={youtubeUrl}
            onChangeText={setYoutubeUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              (!youtubeUrl.trim() || isAnalyzing) &&
                styles.analyzeButtonDisabled,
            ]}
            onPress={handleAnalyze}
            disabled={!youtubeUrl.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.analyzeButtonText}>분석</Text>
            )}
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {/* 분석 결과 */}
      {analysis && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>분석 결과</Text>
            <View style={styles.analysisCard}>
              <AnalysisRow label="제목" value={analysis.title} />
              <AnalysisRow label="BPM" value={String(analysis.bpm)} />
              <AnalysisRow label="키" value={analysis.key} />
              <AnalysisRow label="분위기" value={analysis.mood} />
              <AnalysisRow label="장르" value={analysis.genre} />
              <AnalysisRow label="길이" value={analysis.duration} isLast />
            </View>
          </View>

          {/* 스타일 변환 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>스타일 변환</Text>
            <View style={styles.chipGrid}>
              {STYLE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.chip,
                    selectedStyle === option.key && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedStyle(option.key)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedStyle === option.key && styles.chipTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}

      {/* 안내 플레이스홀더 */}
      {!analysis && !isAnalyzing && (
        <View style={styles.placeholder}>
          <Icon name="logo-youtube" size={48} color={Colors.textSecondary} style={{marginBottom: Spacing.md}} />
          <Text style={styles.placeholderText}>
            YouTube URL을 입력하고 분석 버튼을 눌러주세요
          </Text>
          <Text style={styles.placeholderHint}>
            AI가 원곡을 분석하여 커버 버전을 생성합니다
          </Text>
        </View>
      )}
    </View>
  );
};

/** 분석 결과 행 컴포넌트 */
const AnalysisRow: React.FC<{
  label: string;
  value: string;
  isLast?: boolean;
}> = ({ label, value, isLast }) => (
  <View style={[styles.analysisRow, isLast && styles.analysisRowLast]}>
    <Text style={styles.analysisLabel}>{label}</Text>
    <Text style={styles.analysisValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

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
    marginBottom: Spacing.sm,
  },
  urlRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  urlInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    ...Typography.body,
  },
  analyzeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  analyzeButtonText: {
    ...Typography.button,
    color: '#FFFFFF',
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  analysisCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  analysisRowLast: {
    borderBottomWidth: 0,
  },
  analysisLabel: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  analysisValue: {
    ...Typography.body2,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  placeholder: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  placeholderText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  placeholderHint: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});

export default YouTubeMode;
